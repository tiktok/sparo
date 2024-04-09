import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { SparoProfileService } from '../../services/SparoProfileService';

import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ICommand } from './base';
import type { TerminalService } from '../../services/TerminalService';

export interface IPullCommandOptions {
  profile?: string[];
}

@Command()
export class PullCommand implements ICommand<IPullCommandOptions> {
  public cmd: string = 'pull';
  public description: string = 'Incorporates changes from a remote repository into the current branch.';

  @inject(GitService) private _gitService!: GitService;
  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;

  public builder(yargs: Argv<{}>): void {
    /**
     * sparo pull [repository] [refsepc...] [--profile <profile_name> | --no-profile]
     *
     * sparo pull origin
     *
     * sparo pull origin master
     */
    yargs
      .array('profile')
      .default('profile', [])
      .parserConfiguration({ 'unknown-options-as-args': true })
      .usage(
        'Usage: sparo pull [options] [repository] [refsepc...] [--profile <profile_name> | --no-profile]'
      );
  }

  public handler = async (
    args: ArgumentsCamelCase<IPullCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { _gitService: gitService, _sparoProfileService: sparoProfileService } = this;
    const { terminal } = terminalService;

    terminal.writeDebugLine(`got args in pull command: ${JSON.stringify(args)}`);
    // Collect anything that is not related to profile, pass down them to native git pull
    const pullArgs: string[] = args._ as string[];

    const { isNoProfile, profiles, addProfiles } = await sparoProfileService.preprocessProfileArgs({
      profilesFromArg: args.profile ?? [],
      addProfilesFromArg: []
    });

    // invoke native git pull command
    gitService.executeGitCommand({ args: pullArgs });

    // check whether profile exist in local branch
    if (!isNoProfile) {
      const targetProfileNames: Set<string> = new Set([...profiles, ...addProfiles]);
      const nonExistProfileNames: string[] = [];
      for (const targetProfileName of targetProfileNames) {
        if (!this._sparoProfileService.hasProfileInFS(targetProfileName)) {
          nonExistProfileNames.push(targetProfileName);
        }
      }

      if (nonExistProfileNames.length) {
        const { branch } = gitService.getRepoInfo();
        throw new Error(
          `Pull failed. The following profile(s) are missing in local branch "${branch}": ${Array.from(
            targetProfileNames
          ).join(', ')}`
        );
      }
    }

    // sync local sparse checkout state with given profiles.
    await this._sparoProfileService.syncProfileState({
      profiles: isNoProfile ? undefined : profiles,
      addProfiles
    });
  };

  public getHelp(): string {
    return `pull help`;
  }
}
