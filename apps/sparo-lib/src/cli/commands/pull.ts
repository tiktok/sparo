import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { SparoProfileService } from '../../services/SparoProfileService';

import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ICommand } from './base';
import type { TerminalService } from '../../services/TerminalService';

export interface IPullCommandOptions {
  branch?: string;
  remote?: string;
  profile?: string[];
  addProfile?: string[];
}

@Command()
export class PullCommand implements ICommand<IPullCommandOptions> {
  public cmd: string = 'pull [remote] [branch]';
  public description: string = 'Incorporates changes from a remote repository into the current branch.';

  @inject(GitService) private _gitService!: GitService;
  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;

  public builder(yargs: Argv<{}>): void {
    /**
     * sparo pull [remote] [branch] --profile <profile_name> --add-profile <profile_name> --no-profile
     */
    yargs
      .positional('remote', { type: 'string' })
      .positional('branch', { type: 'string' })
      .string('remote')
      .string('branch')
      .boolean('full')
      .array('profile')
      .default('profile', [])
      .array('add-profile')
      .default('add-profile', []);
  }

  public handler = async (
    args: ArgumentsCamelCase<IPullCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { _gitService: gitService, _sparoProfileService: sparoProfileService } = this;
    const { terminal } = terminalService;

    terminal.writeDebugLine(`got args in pull command: ${JSON.stringify(args)}`);
    const pullArgs: string[] = ['pull'];

    const { branch, remote } = args;

    if (branch && remote) {
      pullArgs.push(remote, branch);
    }

    const { isNoProfile, profiles, addProfiles } = await sparoProfileService.preprocessProfileArgs({
      profilesFromArg: args.profile ?? [],
      addProfilesFromArg: args.addProfile ?? []
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
