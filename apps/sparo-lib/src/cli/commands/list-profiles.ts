import childProcess from 'child_process';
import { Sort } from '@rushstack/node-core-library';
import { inject } from 'inversify';
import { SparoProfileService } from '../../services/SparoProfileService';
import { ICommand } from './base';
import { Command } from '../../decorator';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';

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
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;

  public builder(yargs: Argv<IListProfilesCommandOptions>): void {
    yargs.option('project', {
      type: 'string',
      description: 'List all profiles contains this specified project name'
    });
  }
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
      // Query all profiles that contain the specified project
      const profileProjects: Map<string, string[]> = new Map<string, string[]>();
      for (const [profileName, sparoProfile] of sparoProfiles) {
        const { toSelectors, fromSelectors } = sparoProfile.rushSelectors;
        const rushListCmd: string = `rush list --json ${Array.from(toSelectors)
          .map((x) => `--to ${x}`)
          .join(' ')} ${Array.from(fromSelectors)
          .map((x) => `--from ${x}`)
          .join(' ')} `;
        const res: { projects: IProject[] } = JSON.parse(childProcess.execSync(rushListCmd).toString());
        for (const project of res.projects) {
          if (profileProjects.has(project.name)) {
            const profiles: string[] | undefined = profileProjects.get(project.name);
            profiles?.push(profileName);
          } else {
            profileProjects.set(project.name, [profileName]);
          }
        }
      }

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
