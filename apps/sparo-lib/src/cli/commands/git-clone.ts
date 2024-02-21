import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { TerminalService } from '../../services/TerminalService';

import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ICommand } from './base';

@Command()
export class GitCloneCommand implements ICommand<{}> {
  public cmd: string = 'git-clone';
  public description: string = 'original git clone command';
  @inject(GitService) private _gitService!: GitService;

  public builder(yargs: Argv<{}>): void {}

  public handler = async (args: ArgumentsCamelCase<{}>, terminalService: TerminalService): Promise<void> => {
    const { _gitService: gitService } = this;
    const { terminal } = terminalService;
    const rawArgs: string[] = process.argv.slice(2);
    const idx: number = rawArgs.indexOf(this.cmd);
    if (idx >= 0) {
      rawArgs[idx] = 'clone';
    }
    terminal.writeDebugLine(`proxy args in git-clone command: ${JSON.stringify(rawArgs)}`);
    gitService.executeGitCommand({ args: rawArgs });
  };

  public getHelp(): string {
    return `git-clone help`;
  }
}
