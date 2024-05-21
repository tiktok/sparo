import { inject } from 'inversify';
import { GitService } from '../../services/GitService';

import type { ICommand } from './base';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import type { TerminalService } from '../../services/TerminalService';

export class GitBranchCommand implements ICommand<{}> {
  public cmd: string = 'git-branch';
  public description: string = 'original git branch command';

  @inject(GitService) private _gitService!: GitService;

  public builder(yargs: Argv<{}>): void {
    yargs.help(false);
  }

  public handler = async (args: ArgumentsCamelCase<{}>, terminalService: TerminalService): Promise<void> => {
    const { _gitService: gitService } = this;
    const { terminal } = terminalService;
    const rawArgs: string[] = process.argv.slice(2);
    const index: number = rawArgs.indexOf(this.cmd);
    if (index >= 0) {
      rawArgs[index] = 'branch';
    }
    terminal.writeDebugLine(`proxy args in git-branch command: ${JSON.stringify(rawArgs)}`);
    gitService.executeGitCommand({ args: rawArgs });
  };

  public getHelp(): string {
    return `git-branch help`;
  }
}
