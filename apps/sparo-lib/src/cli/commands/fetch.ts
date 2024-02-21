import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';

import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { GitRepoInfo } from 'git-repo-info';
import type { ICommand } from './base';
import type { LogService } from '../../services/LogService';

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
    logService: LogService
  ): Promise<void> => {
    const { _gitService: gitService } = this;
    const { logger } = logService;
    const repoInfo: GitRepoInfo = gitService.getRepoInfo();
    const { branch: defaultBranch } = repoInfo;

    logger.debug('got args in fetch command: %o', args);
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
