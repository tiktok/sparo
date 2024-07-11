import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { GitRemoteFetchConfigService } from '../../services/GitRemoteFetchConfigService';

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
  @inject(GitRemoteFetchConfigService) private _gitRemoteFetchConfigService!: GitRemoteFetchConfigService;

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
    const { branch: currentBranch } = repoInfo;

    terminal.writeDebugLine(`got args in fetch command: ${JSON.stringify(args)}`);
    const { all, branch } = args;
    let { remote } = args;
    const fetchArgs: string[] = ['fetch'];

    // When no remote is specified, by default the origin remote will be used,
    // unless there’s an upstream branch configured for the current branch.
    remote = this._gitService.getBranchRemote(currentBranch) || 'origin';

    this._gitRemoteFetchConfigService.addRemoteBranchIfNotExists(remote, currentBranch);
    await this._gitRemoteFetchConfigService.pruneRemoteBranchesInGitConfigAsync(remote);

    let restoreSingleBranchCallback: (() => void) | undefined;
    if (all) {
      // Temporary revert single branch fetch if necessary
      restoreSingleBranchCallback = this._gitRemoteFetchConfigService.revertSingleBranchIfNecessary(remote);

      fetchArgs.push('--all');
    } else {
      fetchArgs.push(remote);
      if (branch) {
        fetchArgs.push(branch);
      } else {
        // When no <refspec>s appear on the command line, the refs to fetch are read from remote.<repository>.fetch
        // variables instead
      }
    }

    gitService.executeGitCommand({ args: fetchArgs });

    restoreSingleBranchCallback?.();
  };

  public getHelp(): string {
    return `fetch help`;
  }
}
