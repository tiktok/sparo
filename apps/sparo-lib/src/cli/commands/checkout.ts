import * as child_process from 'child_process';
import { inject } from 'inversify';
import { Command } from '../../decorator';
import type { ICommand } from './base';
import { type ArgumentsCamelCase, type Argv } from 'yargs';
import { GitService } from '../../services/GitService';
import { TerminalService } from '../../services/TerminalService';
import { ILocalStateProfiles, LocalState } from '../../logic/LocalState';
import { SparoProfileService } from '../../services/SparoProfileService';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';

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
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;
  @inject(LocalState) private _localState!: LocalState;
  @inject(TerminalService) private _terminalService!: TerminalService;

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
      .boolean('b')
      .string('branch')
      .string('startPoint')
      .array('profile')
      .default('profile', [])
      .array('add-profile')
      .default('add-profile', []);
  }

  public handler = async (
    args: ArgumentsCamelCase<ICheckoutCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { _gitService: gitService, _localState: localState } = this;
    const { b, B, branch, startPoint } = args;

    const { isNoProfile, profiles, addProfiles } = this._processProfilesFromArg({
      addProfilesFromArg: args.addProfile ?? [],
      profilesFromArg: args.profile
    });

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

    let targetProfileNames: string[] = [];
    if (!isNoProfile) {
      // Get target profile.
      // 1. Read from existing profile from local state.
      // 2. If profile specified from CLI parameter, it takes over.
      // 3. If add profile was specified from CLI parameter, add them to existing profile or profiles from CLI parameter
      const localStateProfiles: ILocalStateProfiles | undefined = await localState.getProfiles();

      if (localStateProfiles) {
        targetProfileNames = Object.keys(localStateProfiles);
      }

      if (profiles.length) {
        targetProfileNames = profiles;
      }

      if (addProfiles.length) {
        targetProfileNames.push(...addProfiles);
      }

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
          `Checkout failed. The following profile(s) are missing in the branch "${operationBranch}": ${targetProfileNames.join(
            ', '
          )}`
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

    // checkout profiles
    localState.reset();
    if (targetProfileNames.length) {
      for (const p of targetProfileNames) {
        const { selections, includeFolders, excludeFolders } =
          await this._gitSparseCheckoutService.resolveSparoProfileAsync(p, {
            localStateUpdateAction: 'add'
          });
        // TODO: policy #1: Can not sparse checkout with uncommitted changes in the cone.

        await this._gitSparseCheckoutService.checkoutAsync({
          selections,
          includeFolders,
          excludeFolders
        });
      }
    } else {
      await this._gitSparseCheckoutService.purgeAsync();
    }
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

  private _processProfilesFromArg({
    profilesFromArg,
    addProfilesFromArg
  }: {
    profilesFromArg: string[];
    addProfilesFromArg: string[];
  }): {
    isNoProfile: boolean;
    profiles: string[];
    addProfiles: string[];
  } {
    /**
     * --profile is defined as array type parameter, specifying --no-profile is resolved to false by yargs.
     *
     * @example --no-profile -> [false]
     * @example --no-profile --profile foo -> [false, "foo"]
     * @example --profile foo --no-profile -> ["foo", false]
     */
    let isNoProfile: boolean = false;
    const profiles: string[] = [];

    for (const profile of profilesFromArg) {
      if (typeof profile === 'boolean' && profile === false) {
        isNoProfile = true;
        continue;
      }

      profiles.push(profile);
    }

    /**
     * --add-profile is defined as array type parameter
     * @example --no-profile --add-profile foo -> throw error
     * @example --profile bar --add-profile foo -> current profiles = bar + foo
     * @example --add-profile foo -> current profiles = current profiles + foo
     */
    const addProfiles: string[] = addProfilesFromArg.filter((p) => typeof p === 'string');

    if (isNoProfile && (profiles.length || addProfiles.length)) {
      throw new Error(
        `"--no-profile" can not be specified at the same time with "--profile" or "--add-profile"`
      );
    }

    return {
      isNoProfile,
      profiles,
      addProfiles
    };
  }
}
