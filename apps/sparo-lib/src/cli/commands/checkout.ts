import * as child_process from 'child_process';
import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { TerminalService } from '../../services/TerminalService';
import { SparoProfileService } from '../../services/SparoProfileService';

import type { ICommand } from './base';
import type { ArgumentsCamelCase, Argv } from 'yargs';
export interface ICheckoutCommandOptions {
  profile: string[];
  branch?: string;
  b?: boolean;
  B?: boolean;
  startPoint?: string;
  addProfile?: string[];
}

type ICheckoutTargetKind = 'branch' | 'tag' | 'commit' | 'filePath';

@Command()
export class CheckoutCommand implements ICommand<ICheckoutCommandOptions> {
  public cmd: string = 'checkout [branch] [start-point]';
  public description: string =
    'Updates files in the working tree to match the version in the index or the specified tree. If no pathspec was given, git checkout will also update HEAD to set the specified branch as the current branch.';

  @inject(GitService) private _gitService!: GitService;
  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;

  public builder(yargs: Argv<{}>): void {
    /**
     * git checkout [-q] [-f] [-m] [<branch>]
     * git checkout [-q] [-f] [-m] --detach [<branch>]
     * git checkout [-q] [-f] [-m] [--detach] <commit>
     * git checkout [-q] [-f] [-m] [[-b|-B|--orphan] <new-branch>] [<start-point>]
     * git checkout [-f] <tree-ish> [--] <pathspec>...
     * git checkout [-f] <tree-ish> --pathspec-from-file=<file> [--pathspec-file-nul]
     * git checkout [-f|--ours|--theirs|-m|--conflict=<style>] [--] <pathspec>...
     * git checkout [-f|--ours|--theirs|-m|--conflict=<style>] --pathspec-from-file=<file> [--pathspec-file-nul]
     * git checkout (-p|--patch) [<tree-ish>] [--] [<pathspec>...]
     *
     * The above list shows all the functions of the `git checkout` command. Currently, only the following two basic scenarios
     *  have been implemented, while other scenarios are yet to be implemented.
     * 1. sparo checkout [-b|-B] <new-branch> [start-point] [--profile <profile...>]
     * 2. sparo checkout [branch] [--profile <profile...>]
     *
     * TODO: implement more checkout functionalities
     */
    yargs
      .positional('branch', {
        type: 'string'
      })
      .positional('start-point', {
        type: 'string'
      })
      .string('branch')
      .string('startPoint')
      .option('b', {
        type: 'boolean',
        description: 'Create a new branch and start it at <start-point>'
      })
      .option('B', {
        type: 'boolean',
        description:
          'Create a new branch and start it at <start-point>; if it already exists, reset it to <start-point>'
      })
      .array('profile')
      .default('profile', [])
      .array('add-profile')
      .default('add-profile', []);
  }

  public handler = async (
    args: ArgumentsCamelCase<ICheckoutCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { _gitService: gitService } = this;
    terminalService.terminal.writeDebugLine(`got args in checkout command: ${JSON.stringify(args)}`);
    const { b, B, startPoint } = args;

    let branch: string | undefined = args.branch;

    /**
     * Special case: "sparo checkout -"
     *
     * "git checkout -" is a shortcut that checks out the previously checked out branch.
     * yargs can not handle this, patch this case here.
     */
    if (!branch) {
      const checkoutIndex: number = process.argv.findIndex((value: string) => value === 'checkout');
      if (checkoutIndex >= 0 && process.argv[checkoutIndex + 1] === '-') {
        branch = '-';
        // FIXME: supports "sparo checkout -"
        throw new Error(
          `Git's "-" token is not yet supported. If this feature is important for your work, please let us know by creating a GitHub issue.`
        );
      }
    }

    let checkoutTargetKind: ICheckoutTargetKind = 'branch';

    /**
     * Since we set up single branch by default and branch can be missing in local, we are going to fetch the branch from remote server here.
     */
    const currentBranch: string = this._getCurrentBranch();
    let operationBranch: string = currentBranch;
    if (b || B) {
      operationBranch = startPoint || operationBranch;
    } else {
      operationBranch = branch || operationBranch;
    }

    if (!operationBranch) {
      throw new Error(`Failed to get branch ${operationBranch}`);
    } else {
      if (operationBranch !== currentBranch) {
        // 1. First, Sparo needs to see the branch matches any branch name
        const isBranchSynced: boolean = this._ensureBranchInLocal(operationBranch);
        if (isBranchSynced) {
          checkoutTargetKind = 'branch';
        } else {
          // 2. If not, try tag names
          const isTagSynced: boolean = this._ensureTagInLocal(operationBranch);
          if (isTagSynced) {
            checkoutTargetKind = 'tag';
          } else {
            // 3. If not, try commit SHA
            const isCommitSHA: boolean = this._gitService.getObjectType(operationBranch) === 'commit';
            if (isCommitSHA) {
              checkoutTargetKind = 'commit';
            } else {
              // 4. Otherwise, treat it as file path
              checkoutTargetKind = 'filePath';
            }
          }
        }
      }
    }

    // preprocess profile related args
    const { isNoProfile, profiles, addProfiles } = await this._sparoProfileService.preprocessProfileArgs({
      addProfilesFromArg: args.addProfile ?? [],
      profilesFromArg: args.profile
    });

    // Check wether profiles exist in local or operation branch
    // Skip check in the following cases:
    // 1. No profile
    // 2. The target kind is file path
    if (!isNoProfile && checkoutTargetKind !== 'filePath') {
      const targetProfileNames: Set<string> = new Set([...profiles, ...addProfiles]);
      const nonExistProfileNames: string[] = [];
      for (const targetProfileName of targetProfileNames) {
        /**
         * If the operation branch is current branch, check the existence from file system.
         * Otherwise, check the existence from git.
         */
        if (operationBranch === currentBranch) {
          if (!this._sparoProfileService.hasProfileInFS(targetProfileName)) {
            nonExistProfileNames.push(targetProfileName);
          }
        } else {
          if (!this._sparoProfileService.hasProfileInGit(targetProfileName, operationBranch)) {
            nonExistProfileNames.push(targetProfileName);
          }
        }
      }

      if (nonExistProfileNames.length) {
        throw new Error(
          `Checkout failed. The following profile(s) are missing in the branch "${operationBranch}": ${Array.from(
            targetProfileNames
          ).join(', ')}`
        );
      }
    }

    // native git checkout
    const checkoutArgs: string[] = (args._ as string[]).slice();
    if (b) {
      checkoutArgs.push('-b');
    }
    if (B) {
      checkoutArgs.push('-B');
    }
    if (branch) {
      checkoutArgs.push(branch);
    }
    if (startPoint) {
      checkoutArgs.push(startPoint);
    }
    if (Array.isArray(args['--'])) {
      checkoutArgs.push('--');
      checkoutArgs.push(...args['--']);
    } else if (process.argv.includes('--')) {
      // "sparo checkout --" works
      checkoutArgs.push('--');
    }
    const result: child_process.SpawnSyncReturns<string> = gitService.executeGitCommand({
      args: checkoutArgs
    });

    if (result.status !== 0) {
      throw new Error(`git checkout failed`);
    }

    // No need to sync sparse checkout state if the target kind is file path
    if (checkoutTargetKind !== 'filePath') {
      // Sync local sparse checkout state with given profiles.
      await this._sparoProfileService.syncProfileState({
        profiles: isNoProfile ? undefined : profiles,
        addProfiles
      });
    }
  };

  public getHelp(): string {
    return '';
  }

  private _ensureBranchInLocal(branch: string): boolean {
    // fetch from remote
    const remote: string = this._gitService.getBranchRemote(branch);

    const fetchResult: child_process.SpawnSyncReturns<string> = this._gitService.executeGitCommand({
      args: [
        'fetch',
        remote,
        `+refs/heads/${branch}:refs/remotes/${remote}/${branch}`,
        // Follows the recommended config fetch.showForcedUpdates false
        '--no-show-forced-updates'
      ]
    });

    if (fetchResult.status === 0) {
      // create local branch from remote branch
      this._gitService.executeGitCommand({
        args: ['branch', branch, `${remote}/${branch}`]
      });

      this._addRemoteBranchIfNotExists(remote, branch);
    }

    const branchExistsInLocal: boolean = Boolean(
      this._gitService
        .executeGitCommandAndCaptureOutput({
          args: ['branch', '--list', branch]
        })
        .trim()
    );

    return branchExistsInLocal;
  }

  private _getCurrentBranch(): string {
    const currentBranch: string = this._gitService
      .executeGitCommandAndCaptureOutput({
        args: ['branch', '--show-current']
      })
      .trim();
    return currentBranch;
  }

  private _ensureTagInLocal(tag: string): boolean {
    // fetch from remote
    const remote: string = 'origin';

    this._gitService.executeGitCommand({
      args: ['fetch', remote, 'tag', tag, '--force']
    });

    const tagExistsInLocal: boolean = Boolean(
      this._gitService
        .executeGitCommandAndCaptureOutput({
          args: ['tag', '--list', tag]
        })
        .trim()
    );
    return tagExistsInLocal;
  }

  private _addRemoteBranchIfNotExists(remote: string, branch: string): void {
    const result: string | undefined = this._gitService.getGitConfig(`remote.${remote}.fetch`, {
      array: true
    });
    const remoteFetchGitConfig: string[] | undefined = result?.split('\n').filter(Boolean);

    // Prevents adding the same remote branch multiple times
    const targetConfig: string = `+refs/heads/${branch}:refs/remotes/${remote}/${branch}`;
    if (remoteFetchGitConfig?.some((value: string) => value === targetConfig)) {
      return;
    }

    this._gitService.executeGitCommand({
      args: ['remote', 'set-branches', '--add', remote, branch]
    });
  }
}
