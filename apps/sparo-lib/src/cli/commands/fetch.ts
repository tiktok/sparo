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
}

@Command()
export class FetchCommand implements ICommand<IFetchCommandOptions> {
  public cmd: string = 'fetch';
  public description: string = 'fetch remote branch to local';

  @inject(GitService) private _gitService!: GitService;
  public builder(yargs: Argv<{}>): void {
    yargs.boolean('full');
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
    const { all, branch = defaultBranch } = args;
    const fetchArgs: string[] = ['fetch'];

    if (all) {
      fetchArgs.push('--all');
    } else {
      fetchArgs.push('origin', branch);
    }

    gitService.executeGitCommand({ args: fetchArgs });
  };

  public getHelp(): string {
    return `fetch help`;
  }
}
