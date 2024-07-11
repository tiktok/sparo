import { inject } from 'inversify';
import type { Argv, ArgumentsCamelCase } from 'yargs';
import { Colorize } from '@rushstack/terminal';

import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';
import { GitCloneService, ICloneOptions } from '../../services/GitCloneService';
import { Stopwatch } from '../../logic/Stopwatch';
import { SparoProfileService } from '../../services/SparoProfileService';
import type { ICommand } from './base';
import type { TerminalService } from '../../services/TerminalService';

export interface ICloneCommandOptions {
  full?: boolean;
  repository: string;
  directory?: string;
  skipGitConfig?: boolean;
  profile?: string[];
}

@Command()
export class CloneCommand implements ICommand<ICloneCommandOptions> {
  public cmd: string = 'clone <repository> [directory]';
  public description: string = '';

  @inject(GitService) private _gitService!: GitService;
  @inject(GitCloneService) private _gitCloneService!: GitCloneService;
  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;

  @inject(GitSparseCheckoutService) private _GitSparseCheckoutService!: GitSparseCheckoutService;

  public builder(yargs: Argv<{}>): void {
    yargs
      .boolean('full')
      .positional('repository', {
        describe: 'The remote repository to clone from.',
        type: 'string'
      })
      .positional('directory', {
        describe:
          'The name of a new directory to clone into. The "humanish" part of the source repository is used if no directory is explicitly given (repo for /path/to/repo.gitService and foo for host.xz:foo/.gitService). Cloning into an existing directory is only allowed if the directory is empty',
        type: 'string'
      })
      .option('skip-git-config', {
        alias: 's',
        describe:
          'By default, Sparo automatically configures the recommended git settings for the repository you are about to clone. If you prefer not to include this step, you can use the input parameter --skip-git-config',
        default: false,
        type: 'boolean'
      })
      .option('branch', {
        alias: 'b',
        describe: 'Specify a branch to clone',
        type: 'string'
      })
      .array('profile')
      .default('profile', [])
      .check((argv) => {
        if (!argv.repository) {
          return 'You must specify a repository to clone.';
        }
        return true;
      });
  }

  public handler = async (
    args: ArgumentsCamelCase<ICloneCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { terminal } = terminalService;

    const directory: string = this._gitCloneService.resolveCloneDirectory(args);

    const cloneOptions: ICloneOptions = {
      ...args,
      directory: directory
    };

    const { full, skipGitConfig } = args;

    terminal.writeLine('Initializing working directory...');
    const stopwatch: Stopwatch = Stopwatch.start();

    if (full) {
      this._gitCloneService.fullClone(cloneOptions);
    } else {
      this._gitCloneService.bloblessClone(cloneOptions);
    }

    process.chdir(directory);

    const { profiles, isNoProfile } = await this._sparoProfileService.preprocessProfileArgs({
      profilesFromArg: args.profile ?? [],
      addProfilesFromArg: []
    });

    if (!full) {
      this._GitSparseCheckoutService.ensureSkeletonExistAndUpdated();

      // check whether profile exist in local branch
      if (!isNoProfile) {
        const targetProfileNames: Set<string> = new Set(profiles);
        const nonExistProfileNames: string[] = [];
        for (const targetProfileName of targetProfileNames) {
          if (!this._sparoProfileService.hasProfileInFS(targetProfileName)) {
            nonExistProfileNames.push(targetProfileName);
          }
        }

        if (nonExistProfileNames.length) {
          throw new Error(
            `Clone failed. The following profile(s) are missing in cloned repo: ${Array.from(
              targetProfileNames
            ).join(', ')}`
          );
        }
      }

      // Avoid redundant sync if no profile is given
      if (!isNoProfile && profiles.size) {
        // sync local sparse checkout state with given profiles.
        await this._sparoProfileService.syncProfileState({
          profiles: isNoProfile ? undefined : profiles
        });
      }
    }

    // set recommended git config
    if (!skipGitConfig) {
      terminal.writeLine(`Applying recommended configuration...`);
      this._gitService.setRecommendConfig({ overwrite: true });
    }

    terminal.writeLine(
      Colorize.green(`Success: Working directory "${directory}" was prepared in ${stopwatch.toString()}.`)
    );
    stopwatch.stop();

    terminal.writeLine();
    terminal.writeLine(`Don't forget to change your shell path:`);
    terminal.writeLine('   ' + Colorize.cyan(`cd ${directory}`));
    terminal.writeLine();

    if (!full && (isNoProfile || profiles.size === 0)) {
      terminal.writeLine('Your next step is to choose a Sparo profile for checkout.');
      terminal.writeLine('To see available profiles in this repo:');
      terminal.writeLine('   ' + Colorize.cyan('sparo list-profiles'));
      terminal.writeLine('To checkout and set profile:');
      terminal.writeLine('   ' + Colorize.cyan('sparo checkout --profile <profile_name>'));
      terminal.writeLine('To checkout and add profile:');
      terminal.writeLine('   ' + Colorize.cyan('sparo checkout --add-profile <profile_name>'));
      terminal.writeLine('To create a new profile:');
      terminal.writeLine('   ' + Colorize.cyan('sparo init-profile --profile <profile_name>'));
    }
  };

  public getHelp(): string {
    return `clone help`;
  }
}
