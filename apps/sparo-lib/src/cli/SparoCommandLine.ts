import 'reflect-metadata';
import { getFromContainer, registerClass } from '../di/container';
import { GitService } from '../services/GitService';
import { CommandService } from '../services/CommandService';
import { ArgvService } from '../services/ArgvService';
import { COMMAND_LIST } from './commands/cmd-list';
import { HelpCommand } from './commands/help';
import { ICommand } from './commands/base';
import { GitVersionCompatibility } from '../logic/GitVersionCompatibility';

export class SparoCommandLine {
  private _commandsMap: Set<string> = new Set<string>();

  private constructor() {}

  public static async launchAsync(): Promise<void> {
    await GitVersionCompatibility.ensureGitVersionAsync();

    const sparo: SparoCommandLine = new SparoCommandLine();
    await sparo.prepareCommandAsync();
    await sparo.runAsync();
  }

  public async prepareCommandAsync(): Promise<void> {
    const commandsService: CommandService = await getFromContainer(CommandService);

    await Promise.all(
      COMMAND_LIST.map(async (cmd): Promise<void> => {
        registerClass(cmd);
        const cmdInstance: ICommand<{}> = await getFromContainer(cmd);
        commandsService.register(cmdInstance);
        this._commandsMap.add(cmdInstance.cmd);
      })
    );
  }

  public async runAsync(): Promise<void> {
    const argv: ArgvService = await getFromContainer(ArgvService);
    await argv.parseArgvAsync();
    const userInputCmdName: string = argv.getUserCommand();
    if (!userInputCmdName) {
      const helpCommand: HelpCommand = await getFromContainer(HelpCommand);
      return helpCommand.handler();
    }

    // proxy to gitService
    if (!this._supportedCommand(userInputCmdName)) {
      const gitService: GitService = await getFromContainer(GitService);
      const args: string[] = process.argv.slice(2);
      gitService.executeGitCommand({
        args
      });
    }
  }

  private _supportedCommand(commandName: string): boolean {
    return this._commandsMap.has(commandName);
  }
}
