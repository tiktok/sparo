import { inject } from 'inversify';
import { GitService } from '../../services/GitService';
import { GracefulShutdownService } from '../../services/GracefulShutdownService';
import { TerminalService } from '../../services/TerminalService';

import type { ArgumentsCamelCase, Argv } from 'yargs';
import type { ICommand } from './base';
import type { SpawnSyncReturns } from 'child_process';

export interface IBranchCommandOptions {
  delete: boolean;
  // Force delete
  D: boolean;
  branch?: string;
}

export class BranchCommand implements ICommand<IBranchCommandOptions> {
  public cmd: string = 'branch [branch]';
  public description: string = 'List, create, or delete branches';

  @inject(GitService) private _gitService!: GitService;
  @inject(GracefulShutdownService) private _gracefulShutdownService!: GracefulShutdownService;
  @inject(TerminalService) private _terminalService!: TerminalService;

  public builder(yargs: Argv<{}>): void {
    yargs
      .option('delete', {
        alias: 'd',
        describe:
          'Delete a branch. The branch must be fully merged in its upstream branch, or in HEAD if no upstream was set with --track or --set-upstream-to.',
        default: false,
        type: 'boolean'
      })
      .option('D', {
        description: 'Shortcut for --delete --force',
        default: false,
        type: 'boolean'
      })
      .positional('branch', {
        type: 'string'
      })
      .parserConfiguration({ 'unknown-options-as-args': true });
  }

  public handler = async (
    args: ArgumentsCamelCase<IBranchCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { terminal } = terminalService;
    const { _gitService: gitService } = this;
    terminal.writeDebugLine(`got args in branch command: ${JSON.stringify(args)}`);

    // Collect raw args
    const branchArgs: string[] = args._ as string[];

    const { branch } = args;
    const isDelete: boolean = args.delete;
    const isForceDelete: boolean = args.D;

    if (branch) {
      branchArgs.splice(1, 0, branch);
    }
    if (isForceDelete) {
      branchArgs.splice(1, 0, '-D');
    } else if (isDelete) {
      branchArgs.splice(1, 0, '-d');
    }

    const result: SpawnSyncReturns<string> = gitService.executeGitCommand({
      args: branchArgs
    });

    if (result.status === 0) {
      if ((isDelete || isForceDelete) && branch) {
        this._removeRemoteBranchIfNecessary(branch);
      }
    }
  };

  public getHelp(): string {
    return '';
  }

  private _removeRemoteBranchIfNecessary(branch: string): void {
    const remote: string = this._gitService.getBranchRemote(branch);

    const result: string | undefined = this._gitService.getGitConfig(`remote.${remote}.fetch`, {
      array: true
    });

    const remoteFetchGitConfig: string[] | undefined = result?.split('\n').filter(Boolean);
    if (remoteFetchGitConfig) {
      const targetConfig: string = `+refs/heads/${branch}:refs/remotes/${remote}/${branch}`;

      // With set structure, duplicate target configurations can be removed in a single run
      const remoteFetchGitConfigSet: Set<string> = new Set<string>(remoteFetchGitConfig);
      if (remoteFetchGitConfigSet.has(targetConfig)) {
        // There is no easy way to unset one branch configuration,
        // So, delete all configuration and restores branches except the target branch

        // Restore previous git config if something went wrong
        const callback = (): void => {
          this._setRemoteFetchGitConfig(remote, remoteFetchGitConfig);
          this._terminalService.terminal.writeDebugLine(
            `Restored previous remote.${remote}.fetch configuration`
          );
        };

        remoteFetchGitConfigSet.delete(targetConfig);

        const updatedRemoteFetchGitConfig: string[] = Array.from(remoteFetchGitConfigSet);

        this._gracefulShutdownService.registerCallback(callback);
        this._setRemoteFetchGitConfig(remote, updatedRemoteFetchGitConfig);
        this._terminalService.terminal.writeDebugLine(`Removed branch "${branch}" in remote.${remote}.fetch`);
        this._gracefulShutdownService.unregisterCallback(callback);
      }
    }
  }

  private _setRemoteFetchGitConfig(remote: string, remoteFetchGitConfig: string[]): void {
    this._gitService.unsetGitConfig(`remote.${remote}.fetch`);
    for (const value of remoteFetchGitConfig) {
      this._gitService.setGitConfig(`remote.${remote}.fetch`, value, { add: true });
    }
  }
}
