import * as child_process from 'child_process';
import { inject } from 'inversify';
import { JsonFile } from '@rushstack/node-core-library';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { GitRemoteFetchConfigService } from '../../services/GitRemoteFetchConfigService';
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
  to?: string[];
  from?: string[];
}

type ICheckoutTargetKind = 'branch' | 'tag' | 'commit' | 'filePath';

@Command()
export class CheckoutCommand implements ICommand<ICheckoutCommandOptions> {
  public cmd: string = 'checkout [branch] [start-point]';
  public description: string =
    'Updates files in the working tree to match the version in the index or the specified tree. If no pathspec was given, git checkout will also update HEAD to set the specified branch as the current branch.';

  @inject(GitService) private _gitService!: GitService;
  @inject(GitRemoteFetchConfigService) private _gitRemoteFetchConfigService!: GitRemoteFetchConfigService;
  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;

  public builder = (yargs: Argv<{}>): void => {
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
     * 3. sparo checkout [branch] [--to <project-name...>] [--from <project-name...>]
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
      .option('profile', {
        describe:
          'Checkout projects by specified profile(s). The profiles will be recorded and reused by other sparo commands. For example, running "sparo checkout <branch>" sparse checkout based on the reused profiles after running "git checkout"',
        default: [],
        type: 'array'
      })
      .option('add-profile', {
        describe:
          'Checkout projects with recorded profile(s) and the specified added profile(s). Adds the specified added profile(s) to sparo recorded profiles',
        default: [],
        type: 'array'
      })
      .option('no-profile', {
        hidden: false,
        describe: 'Checkout projects without any profiles and clear all recorded profiles',
        type: 'boolean'
      })
      .option('to', {
        type: 'array',
        default: [],
        description:
          'Checkout projects up to (and including) project <to..>, can be used together with option --profile/--add-profile to form a union selection of the two options. The projects selectors here will never replace what have been checked out by profiles'
      })
      .option('from', {
        type: 'array',
        default: [],
        description:
          'Checkout projects downstream from (and including itself and all its dependencies) project <from..>, can be used together with option --profile/--add-profile to form a union selection of the two options. The projects selectors here will never replace what have been checked out by profiles'
      })
      .completion('completion', false, (current, argv, done) => {
        const isNoProfile: boolean = argv.profile.some(
          (profile: string | boolean) => typeof profile === 'boolean' && profile === false
        );
        const shortParameters: string[] = [argv.b ? '' : '-b', argv.B ? '' : '-B'].filter(Boolean);
        const longParameters: string[] = [
          isNoProfile ? '' : '--no-profile',
          isNoProfile ? '' : '--profile',
          isNoProfile ? '' : '--add-profile',
          '--to',
          '--from'
        ].filter(Boolean);

        if (current === '-') {
          done(shortParameters);
        } else if (current === '--') {
          done(longParameters);
        } else if (current === '--profile' || current === '--add-profile') {
          const profileNameSet: Set<string> = new Set(this._sparoProfileService.loadProfileNames());
          for (const profile of argv.profile) {
            if (typeof profile === 'string') {
              profileNameSet.delete(profile);
            }
          }
          for (const profile of argv.addProfile) {
            if (typeof profile === 'string') {
              profileNameSet.delete(profile);
            }
          }
          done(Array.from(profileNameSet));
        } else if (current === '--to' || current === '--from') {
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
            if (current === '--to') {
              for (const packageName of argv.to) {
                packageNameSet.delete(packageName);
              }
            }
            if (current === '--from') {
              for (const packageName of argv.from) {
                packageNameSet.delete(packageName);
              }
            }
            const packageNames: string[] = Array.from(packageNameSet).sort();
            if (process.cwd() !== root) {
              packageNames.unshift('.');
            }
            done(packageNames);
          }
          done([]);
        } else if (current.startsWith('--')) {
          done(longParameters.filter((parameter) => parameter.startsWith(current)));
        } else {
          const previous: string = process.argv.slice(-2)[0];
          if (previous === '--profile' || previous === '--add-profile') {
            const profileNameSet: Set<string> = new Set(this._sparoProfileService.loadProfileNames());
            for (const profile of argv.profile) {
              if (typeof profile === 'string') {
                profileNameSet.delete(profile);
              }
            }
            for (const profile of argv.addProfile) {
              if (typeof profile === 'string') {
                profileNameSet.delete(profile);
              }
            }
            done(Array.from(profileNameSet).filter((profileName) => profileName.startsWith(current)));
          } else if (previous === '--to' || previous === '--from') {
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
              if (previous === '--to') {
                for (const packageName of argv.to) {
                  packageNameSet.delete(packageName);
                }
              }
              if (previous === '--from') {
                for (const packageName of argv.from) {
                  packageNameSet.delete(packageName);
                }
              }
              const packageNames: string[] = Array.from(packageNameSet).sort();
              done(packageNames.filter((packageName) => packageName.startsWith(current)));
            }
            done([]);
          }
          done([]);
        }
      });
  };

  public handler = async (
    args: ArgumentsCamelCase<ICheckoutCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { _gitService: gitService } = this;
    terminalService.terminal.writeDebugLine(`got args in checkout command: ${JSON.stringify(args)}`);
    const { b, B, startPoint, to, from } = args;
    const toProjects: Set<string> = new Set(to);
    const fromProjects: Set<string> = new Set(from);

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
        // - is a shortcut of @{-1}
        branch = gitService.getPreviousBranch(1);
        if (!branch) {
          throw new Error(`Argument "-" is unknown revision or path not in the working tree.`);
        }
      }
    }

    let checkoutTargetKind: ICheckoutTargetKind = 'branch';

    /**
     * Since we set up single branch by default and branch can be missing in local, we are going to fetch the branch from remote server here.
     */
    const currentBranch: string = this._gitService.getCurrentBranch();
    let operationBranch: string = currentBranch;
    if (b || B) {
      operationBranch = startPoint || operationBranch;
    } else {
      operationBranch = branch || operationBranch;
    }

    if (!operationBranch) {
      if (!currentBranch) {
        // If current branch is missing, it means the repository is in a detached HEAD state.
        // Let's treat it as a commit SHA for convenience now.
        checkoutTargetKind = 'commit';
      } else {
        // This should not happen
        throw new Error(`Failed to get branch ${operationBranch}`);
      }
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
      } else {
        const remote: string = this._gitService.getBranchRemote(operationBranch);
        this._gitRemoteFetchConfigService.addRemoteBranchIfNotExists(remote, operationBranch);
      }
    }

    // preprocess profile related args
    const { isNoProfile, profiles, addProfiles, isProfileRestoreFromLocal } =
      await this._sparoProfileService.preprocessProfileArgs({
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
        addProfiles,
        fromProjects,
        toProjects,
        isProfileRestoreFromLocal
      });
    }
  };

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

      this._gitRemoteFetchConfigService.addRemoteBranchIfNotExists(remote, branch);
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
}
