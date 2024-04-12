import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';

import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { GitRepoInfo } from 'git-repo-info';
import type { ICommand } from './base';
import type { TerminalService } from '../../services/TerminalService';

export interface IFetchCommandOptions {
  all?: boolean;
  branch?: string;
  remote?: string;
}

@Command()
export class FetchCommand implements ICommand<IFetchCommandOptions> {
  public cmd: string = 'fetch [remote] [branch]';
  public description: string = 'fetch remote branch to local';

  @inject(GitService) private _gitService!: GitService;
  public builder(yargs: Argv<{}>): void {
    /**
     * sparo fetch <remote> <branch> [--all]
     */
    yargs
      .positional('remote', { type: 'string' })
      .positional('branch', { type: 'string' })
      .string('remote')
      .string('branch')
      .boolean('all');
  }

  public handler = async (
    args: ArgumentsCamelCase<IFetchCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { _gitService: gitService } = this;
    const { terminal } = terminalService;
    const repoInfo: GitRepoInfo = gitService.getRepoInfo();
    const { branch: defaultBranch } = repoInfo;

    terminal.writeDebugLine(`got args in fetch command: ${JSON.stringify(args)}`);
    const { all, branch = defaultBranch, remote = this._gitService.getBranchRemote(branch) } = args;
    const fetchArgs: string[] = ['fetch'];

    let remoteFetchGitConfig: string[] | undefined;
    if (all) {
      // Temporary revert single branch fetch
      const currentRemoteFetchGitConfig: string[] | undefined = this._getRemoteFetchGitConfig(remote);
      if (currentRemoteFetchGitConfig) {
        this._setAllBranchFetch(remote);
        remoteFetchGitConfig = currentRemoteFetchGitConfig;
      }

      fetchArgs.push('--all');
    } else {
      fetchArgs.push(remote, branch);
    }

    gitService.executeGitCommand({ args: fetchArgs });

    if (remoteFetchGitConfig) {
      this._restoreSingleBranchFetch(remote, remoteFetchGitConfig);
    }
  };

  public getHelp(): string {
    return `fetch help`;
  }

  private _getRemoteFetchGitConfig(remote: string): string[] | undefined {
    const result: string | undefined = this._gitService.getGitConfig(`remote.${remote}.fetch`, {
      array: true
    });
    return result?.split('\n').filter(Boolean);
  }

  private _setAllBranchFetch(remote: string): void {
    this._gitService.setGitConfig(`remote.${remote}.fetch`, `+refs/heads/*:refs/remotes/${remote}/*`, {
      replaceAll: true
    });
  }

  private _restoreSingleBranchFetch(remote: string, remoteFetchGitConfig: string[]): void {
    this._gitService.unsetGitConfig(`remote.${remote}.fetch`);
    for (const value of remoteFetchGitConfig) {
      this._gitService.setGitConfig(`remote.${remote}.fetch`, value, { add: true });
    }
  }
}
