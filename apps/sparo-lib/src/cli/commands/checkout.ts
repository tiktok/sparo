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
    const { b, B, branch, startPoint } = args;

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
        const isSynced: boolean = this._ensureBranchInLocal(operationBranch);
        if (!isSynced) {
          throw new Error(`Failed to sync ${operationBranch} from remote server`);
        }
      }
    }

    // preprocess profile related args
    const { isNoProfile, profiles, addProfiles } = await this._sparoProfileService.preprocessProfileArgs({
      addProfilesFromArg: args.addProfile ?? [],
      profilesFromArg: args.profile
    });

    // check wether profiles exist in local or operation branch
    if (!isNoProfile) {
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
    const result: child_process.SpawnSyncReturns<string> = gitService.executeGitCommand({
      args: checkoutArgs
    });

    if (result.status !== 0) {
      throw new Error(`git checkout failed`);
    }

    // sync local sparse checkout state with given profiles.
    await this._sparoProfileService.syncProfileState({
      profiles: isNoProfile ? undefined : profiles,
      addProfiles
    });
  };

  public getHelp(): string {
    return '';
  }

  private _ensureBranchInLocal(branch: string): boolean {
    const branchExistsInLocal: boolean = Boolean(
      this._gitService
        .executeGitCommandAndCaptureOutput({
          args: ['branch', '--list', branch]
        })
        .trim()
    );
    if (!branchExistsInLocal) {
      // fetch from remote
      const remote: string = this._gitService.getBranchRemote(branch);

      const fetchResult: child_process.SpawnSyncReturns<string> = this._gitService.executeGitCommand({
        args: ['fetch', remote, `refs/heads/${branch}:refs/remotes/${remote}/${branch}`]
      });
      if (fetchResult.status !== 0) {
        return false;
      }

      // create local branch from remote branch
      const createBranchResult: child_process.SpawnSyncReturns<string> = this._gitService.executeGitCommand({
        args: ['branch', branch, `${remote}/${branch}`]
      });
      if (createBranchResult.status !== 0) {
        return false;
      }
    }

    return true;
  }

  private _getCurrentBranch(): string {
    const currentBranch: string = this._gitService
      .executeGitCommandAndCaptureOutput({
        args: ['branch', '--show-current']
      })
      .trim();
    return currentBranch;
  }
}
