import { JsonFile, Sort, Async, Executable } from '@rushstack/node-core-library';
import { inject } from 'inversify';
import { SparoProfileService } from '../../services/SparoProfileService';
import { ICommand } from './base';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';

import type { ChildProcess } from 'child_process';
import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { TerminalService } from '../../services/TerminalService';
import type { SparoProfile } from '../../logic/SparoProfile';

export interface IProject {
  name: string;
  path: string;
}
export interface IListProfilesCommandOptions {
  project?: string;
}

@Command()
export class ListProfilesCommand implements ICommand<IListProfilesCommandOptions> {
  public cmd: string = 'list-profiles';
  public description: string =
    'List all available profiles or query profiles that contain the specified project name';
  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;
  @inject(GitService) private _gitService!: GitService;
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;

  public builder = (yargs: Argv<IListProfilesCommandOptions>): void => {
    yargs
      .option('project', {
        type: 'string',
        description: 'List all profiles contains this specified project name'
      })
      .completion('completion', false, (current, argv, done) => {
        const longParameters: string[] = [argv.project ? '' : '--project'].filter(Boolean);
        if (current === '--') {
          done(longParameters);
        } else if (current === '--project') {
          let rushJson: { projects?: { packageName: string }[] } = {};
          const root: string = this._gitService.getRepoInfo().root;
          try {
            rushJson = JsonFile.load(`${root}/rush.json`);
          } catch (e) {
            // no-catch
          }
          if (Array.isArray(rushJson.projects)) {
            const packageNameSet: Set<string> = new Set<string>(
              rushJson.projects.map((project) => project.packageName)
            );
            const packageNames: string[] = Array.from(packageNameSet).sort();
            done(packageNames);
          }
        } else if (current.startsWith('--')) {
          done(longParameters.filter((parameter) => parameter.startsWith(current)));
        } else {
          const previous: string = process.argv.slice(-2)[0];
          if (previous === '--project') {
            let rushJson: { projects?: { packageName: string }[] } = {};
            const root: string = this._gitService.getRepoInfo().root;
            try {
              rushJson = JsonFile.load(`${root}/rush.json`);
            } catch (e) {
              // no-catch
            }
            if (Array.isArray(rushJson.projects)) {
              const packageNameSet: Set<string> = new Set<string>(
                rushJson.projects.map((project) => project.packageName)
              );
              const packageNames: string[] = Array.from(packageNameSet).sort();
              done(packageNames.filter((packageName) => packageName.startsWith(current)));
            }
          }
          done([]);
        }
      });
  };
  public handler = async (
    args: ArgumentsCamelCase<IListProfilesCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { project } = args;

    terminalService.terminal.writeLine('Listing profiles...');
    terminalService.terminal.writeLine();

    // ensure sparse profiles folder
    this._gitSparseCheckoutService.ensureSkeletonExistAndUpdated();

    const sparoProfiles: Map<string, SparoProfile> = await this._sparoProfileService.getProfilesAsync();

    if (!project) {
      // List all available profiles
      terminalService.terminal.writeLine('All available profiles:');
      // Ensure the stable order of the profiles
      Sort.sortMapKeys(sparoProfiles);
      terminalService.terminal.writeLine(Array.from(sparoProfiles.keys()).join('\n'));
    } else {
      terminalService.terminal.writeLine(`Query profiles for project ${project}...`);

      Executable.spawnSync('rush', ['list', '--help']);

      // Query all profiles that contain the specified project
      const profileProjects: Map<string, string[]> = new Map<string, string[]>();
      await Async.forEachAsync(
        sparoProfiles.entries(),
        async ([profileName, sparoProfile]) => {
          const { toSelectors, fromSelectors } = sparoProfile.rushSelectors;
          const rushListArgs: string[] = ['list', '--json'];
          for (const selector of toSelectors) {
            rushListArgs.push('--to');
            rushListArgs.push(selector);
          }
          for (const selector of fromSelectors) {
            rushListArgs.push('--from');
            rushListArgs.push(selector);
          }
          const childProcess: ChildProcess = Executable.spawn('testrush', rushListArgs, {
            stdio: ['ignore', 'pipe', 'pipe']
          });
          childProcess.stdout!.setEncoding('utf8');
          childProcess.stderr!.setEncoding('utf8');

          const rushListResultJsonString: string = await new Promise((resolve, reject) => {
            let stdoutString: string = '';
            let errorMessage: string = '';

            childProcess.stdout!.on('data', (chunk: Buffer) => {
              stdoutString += chunk.toString();
            });
            childProcess.stderr!.on('data', (chunk: Buffer) => {
              errorMessage += chunk.toString();
            });
            childProcess.on('close', (exitCode: number | null, signal: NodeJS.Signals | null) => {
              if (exitCode) {
                reject(
                  new Error(
                    `rush exited with error code ${exitCode}${errorMessage ? `: ${errorMessage}` : ''}`
                  )
                );
              } else if (signal) {
                reject(new Error(`rush terminated by signal ${signal}`));
              }
              resolve(stdoutString);
            });
          });
          try {
            const res: { projects: IProject[] } = JSON.parse(rushListResultJsonString.trim());
            for (const project of res.projects) {
              if (profileProjects.has(project.name)) {
                const profiles: string[] | undefined = profileProjects.get(project.name);
                profiles?.push(profileName);
              } else {
                profileProjects.set(project.name, [profileName]);
              }
            }
          } catch (e) {
            console.warn('====', profileName, rushListArgs.join(' '));
            console.warn(rushListResultJsonString.split('\n').slice(0, 10).join('\n'));
            console.warn('======');
            throw e;
          }
        },
        {
          concurrency: 3
        }
      );

      const profilesContainProject: string[] | undefined = profileProjects.get(project);
      if (profilesContainProject) {
        // Ensure the stable order of the profiles
        Sort.sortBy(profilesContainProject, (x) => x, Sort.compareByValue);
        terminalService.terminal.writeLine(
          `${project} was included in the below profiles:\n ${profilesContainProject.join('\n')}`
        );
      } else {
        terminalService.terminal.writeErrorLine(`${project} is not included in any pre-configured profile`);
      }
    }
  };
}
