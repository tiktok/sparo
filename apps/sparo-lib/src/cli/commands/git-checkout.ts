import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { TerminalService } from '../../services/TerminalService';

import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ICommand } from './base';

@Command()
export class GitCheckoutCommand implements ICommand<{}> {
  public cmd: string = 'git-checkout';
  public description: string = 'original git checkout command';
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
      rawArgs[index] = 'checkout';
    }
    terminal.writeDebugLine(`proxy args in git-checkout command: ${JSON.stringify(rawArgs)}`);
    gitService.executeGitCommand({ args: rawArgs });
  };

  public getHelp(): string {
    return `git-checkout help`;
  }
}
