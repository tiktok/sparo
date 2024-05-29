import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { GitRemoteFetchConfigService } from '../../services/GitRemoteFetchConfigService';
import { SparoProfileService } from '../../services/SparoProfileService';

import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ICommand } from './base';
import type { TerminalService } from '../../services/TerminalService';

export interface IPullCommandOptions {
  remote?: string;
  profile?: string[];
}

@Command()
export class PullCommand implements ICommand<IPullCommandOptions> {
  public cmd: string = 'pull [remote]';
  public description: string = 'Incorporates changes from a remote repository into the current branch.';

  @inject(GitService) private _gitService!: GitService;
  @inject(GitRemoteFetchConfigService) private _gitRemoteFetchConfigService!: GitRemoteFetchConfigService;
  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;

  public builder = (yargs: Argv<{}>): void => {
    /**
     * sparo pull [repository] [refsepc...] [--profile <profile_name> | --no-profile]
     *
     * sparo pull origin
     *
     * sparo pull origin master
     */
    yargs
      .positional('remote', {
        type: 'string'
      })
      .array('profile')
      .default('profile', [])
      .parserConfiguration({ 'unknown-options-as-args': true })
      .usage(
        '$0 pull [options] [repository] [refsepc...] [--profile <profile_name> | --no-profile]' +
          '\n\n' +
          this.description
      );
  };

  public handler = async (
    args: ArgumentsCamelCase<IPullCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { _gitService: gitService, _sparoProfileService: sparoProfileService } = this;
    const { terminal } = terminalService;

    terminal.writeDebugLine(`got args in pull command: ${JSON.stringify(args)}`);
    // Collect anything that is not related to profile, pass down them to native git pull
    const pullArgs: string[] = args._ as string[];

    const { isNoProfile, profiles, addProfiles, isProfileRestoreFromLocal } =
      await sparoProfileService.preprocessProfileArgs({
        profilesFromArg: args.profile ?? [],
        addProfilesFromArg: []
      });

    const { remote } = args;
    if (remote) {
      pullArgs.splice(1, 0, remote);
    }

    await this._gitRemoteFetchConfigService.pruneRemoteBranchesInGitConfigAsync(remote || 'origin');

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
      addProfiles,
      isProfileRestoreFromLocal
    });
  };

  public getHelp(): string {
    return `pull help`;
  }
}
