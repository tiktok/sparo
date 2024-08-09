import { Command } from '../../decorator';
import { TerminalService } from '../../services/TerminalService';
import { inject } from 'inversify';
import { GitService } from '../../services/GitService';

import type { ArgumentsCamelCase, Argv } from 'yargs';
import type { ICommand } from './base';

@Command()
export class GitFetchCommand implements ICommand<{}> {
  public cmd: string = 'git-fetch';
  public description: string = 'original git fetch command';

  @inject(GitService) public _gitService!: GitService;

  public builder(yargs: Argv<{}>): void {
    yargs.help(false);
  }

  public handler = async (args: ArgumentsCamelCase<{}>, terminalService: TerminalService): Promise<void> => {
    const { _gitService: gitService } = this;
    const { terminal } = terminalService;
    const rawArgs: string[] = process.argv.slice(2);
    const index: number = rawArgs.indexOf(this.cmd);
    if (index >= 0) {
      rawArgs[index] = 'fetch';
    }
    terminal.writeDebugLine(`proxy args in git-fetch command: ${JSON.stringify(rawArgs)}`);
    gitService.executeGitCommand({ args: rawArgs });
  };
}
