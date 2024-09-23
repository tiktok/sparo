import { inject } from 'inversify';
import { Colorize } from '@rushstack/terminal';

import { Service } from '../decorator';
import { GitService } from './GitService';
import { TerminalService } from './TerminalService';
import { GracefulShutdownService } from './GracefulShutdownService';

/**
 * Helper class for git remote.origin.fetch config
 *
 * @alpha
 */
@Service()
export class GitRemoteFetchConfigService {
  @inject(GitService) private _gitService!: GitService;
  @inject(TerminalService) private _terminalService!: TerminalService;
  @inject(GracefulShutdownService) private _gracefulShutdownService!: GracefulShutdownService;

  public addRemoteBranchIfNotExists(remote: string, branch: string): void {
    const remoteFetchGitConfig: string[] | undefined = this._getRemoteFetchInGitConfig(remote);

    if (remoteFetchGitConfig) {
      const targetConfig: string = `+refs/heads/${branch}:refs/remotes/${remote}/${branch}`;
      if (
        // Prevents adding remote branch if it is not single branch mode
        remoteFetchGitConfig.includes(`+refs/heads/*:refs/remotes/${remote}/*`) ||
        // Prevents adding the same remote branch multiple times
        remoteFetchGitConfig?.some((value: string) => value === targetConfig)
      ) {
        return;
      }
    }

    this._gitService.executeGitCommand({
      args: ['remote', 'set-branches', '--add', remote, branch]
    });

    // Example: branch.feature-foo.remote=origin
    this._gitService.setGitConfig(`branch.${branch}.remote`, remote);
    // Example: branch.feature-foo.merge=refs/heads/feature-foo
    this._gitService.setGitConfig(`branch.${branch}.merge`, `refs/heads/${branch}`);
  }

  public pruneRemoteBranchesInGitConfigAsync = async (remote: string): Promise<void> => {
    const remoteFetchConfig: string[] | undefined = this._getRemoteFetchInGitConfig(remote);
    if (!remoteFetchConfig) {
      return;
    }

    const invalidRemoteFetchConfig: string[] = [];
    const invalidBranches: string[] = [];
    const branchToValues: Map<string, Set<string>> = this.getBranchesInfoFromRemoteFetchConfig(
      remoteFetchConfig
    );
    const checkBranches: string[] = Array.from(branchToValues.keys()).filter((x) => x !== '*');

    this._terminalService.terminal.writeLine(`Checking tracking branches...`);

    const remoteBranchExistenceInfo: Record<string, boolean> =
      await this._gitService.checkRemoteBranchesExistenceAsync(remote, checkBranches);

    for (const [branch, isExists] of Object.entries(remoteBranchExistenceInfo)) {
      if (isExists) {
        continue;
      }

      invalidBranches.push(branch);

      const remoteFetchConfigValues: Set<string> | undefined = branchToValues.get(branch);
      if (remoteFetchConfigValues) {
        invalidRemoteFetchConfig.push(...remoteFetchConfigValues);
      }
    }

    if (invalidRemoteFetchConfig.length) {
      for (const invalidBranch of invalidBranches) {
        this._terminalService.terminal.writeLine(
          Colorize.gray(
            `Branch "${invalidBranch}" doesn't exist remotely. It might have been merged into the main branch. Pruning this branch from the git configuration.`
          )
        );
      }
      const nextRemoteFetchConfigSet: Set<string> = new Set<string>(remoteFetchConfig);
      this._terminalService.terminal.writeDebugLine(
        `Pruning the following value(s) in remote.${remote}.fetch from git configuration`
      );
      for (const invalidValue of invalidRemoteFetchConfig) {
        this._terminalService.terminal.writeDebugLine(invalidValue);
        nextRemoteFetchConfigSet.delete(invalidValue);
      }

      // Restores previous git configuration if something went wrong
      const callback = (): void => {
        this._setRemoteFetchInGitConfig(remote, remoteFetchConfig);
        this._terminalService.terminal.writeDebugLine(
          `Restore previous remote.${remote}.fetch to git configuration`
        );
      };

      this._gracefulShutdownService.registerCallback(callback);
      this._setRemoteFetchInGitConfig(remote, Array.from(nextRemoteFetchConfigSet));
      this._gracefulShutdownService.unregisterCallback(callback);

      // Clean up other git configurations
      for (const invalidBranch of invalidBranches) {
        this._gitService.unsetGitConfig(`branch.${invalidBranch}.remote`);
        this._gitService.unsetGitConfig(`branch.${invalidBranch}.merge`);
      }
    }
  };

  /**
   * Sparo uses single branch mode as default. This function switch to all branch mode from single branch mode.
   * And, it returns a callback function to go back to single branch mode with previous git configuration.
   * It's used in "sparo fetch --all" command
   */
  public revertSingleBranchIfNecessary = (remote: string): (() => void) | undefined => {
    let remoteFetchGitConfig: string[] | undefined = this._getRemoteFetchInGitConfig(remote);
    let callback: (() => void) | undefined;
    if (remoteFetchGitConfig && !remoteFetchGitConfig.includes(`+refs/heads/*:refs/remotes/${remote}/*`)) {
      this._setAllBranchFetch(remote);

      callback = (): void => {
        if (remoteFetchGitConfig) {
          this._setRemoteFetchInGitConfig(remote, remoteFetchGitConfig);

          // Avoid memory leaking
          remoteFetchGitConfig = undefined;
          this._gracefulShutdownService.unregisterCallback(callback);
        }
      };

      this._gracefulShutdownService.registerCallback(callback);
    }

    return callback;
  };

  /**
   * Reads remote.origin.fetch from git configuration. It returns a mapping
   *
   * Map {
   *   'master' => Set { '+refs/heads/master:refs/remotes/origin/master' }
   * }
   */
  public getBranchesInfoFromRemoteFetchConfig(remoteFetchConfig: string[]): Map<string, Set<string>> {
    const branchRegExp: RegExp = /^(?:\+)?refs\/heads\/([^:]+):/;
    const branchToValues: Map<string, Set<string>> = new Map<string, Set<string>>();
    for (const remoteFetchConfigValue of remoteFetchConfig) {
      const match: RegExpMatchArray | null = remoteFetchConfigValue.match(branchRegExp);
      if (match) {
        const branch: string | undefined = match[1];
        if (branch) {
          let values: Set<string> | undefined = branchToValues.get(branch);
          if (!values) {
            values = new Set<string>();
            branchToValues.set(branch, values);
          }
          values.add(remoteFetchConfigValue);
        }
      }
    }
    return branchToValues;
  }

  /**
   * This function is used for completion
   */
  public getBranchNamesFromRemote(remote: string): string[] {
    const remoteFetchConfig: string[] | undefined = this._getRemoteFetchInGitConfig(remote);
    if (!remoteFetchConfig) {
      return [];
    }
    return Array.from(this.getBranchesInfoFromRemoteFetchConfig(remoteFetchConfig).keys());
  }

  private _getRemoteFetchInGitConfig(remote: string): string[] | undefined {
    const result: string | undefined = this._gitService.getGitConfig(`remote.${remote}.fetch`, {
      array: true
    });
    const remoteFetchGitConfig: string[] | undefined = result?.split('\n').filter(Boolean);
    return remoteFetchGitConfig;
  }

  /**
   * There is no easy way to unset one branch from git configuration
   * So, delete all remote.origin.fetch configuration and restores expected value
   */
  private _setRemoteFetchInGitConfig(remote: string, remoteFetchGitConfig: string[]): void {
    const key: string = `remote.${remote}.fetch`;
    this._gitService.unsetGitConfig(key);
    for (const value of remoteFetchGitConfig) {
      this._gitService.setGitConfig(key, value, { add: true });
    }
  }

  private _setAllBranchFetch(remote: string): void {
    this._gitService.setGitConfig(`remote.${remote}.fetch`, `+refs/heads/*:refs/remotes/${remote}/*`, {
      replaceAll: true
    });
  }
}
