import 'reflect-metadata';
import { getFromContainer, registerClass } from '../di/container';
import { CommandService } from '../services/CommandService';
import { CI_COMMAND_LIST } from './commands/cmd-list';
import { ICommand } from './commands/base';
import { ArgvService } from '../services/ArgvService';
import { CIHelpCommand } from './commands/ci-help';
import { GitVersionCompatibility } from '../logic/GitVersionCompatibility';

export class SparoCICommandLine {
  private _commandsMap: Set<string> = new Set<string>();

  private constructor() {}

  public static async launchAsync(): Promise<void> {
    await GitVersionCompatibility.ensureGitVersionAsync();

    const sparoCI: SparoCICommandLine = new SparoCICommandLine();
    await sparoCI.prepareCommandAsync();
    await sparoCI.runAsync();
  }

  public async prepareCommandAsync(): Promise<void> {
    const commandsService: CommandService = await getFromContainer(CommandService);

    await Promise.all(
      CI_COMMAND_LIST.map(async (cmd): Promise<void> => {
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
    if (!userInputCmdName || !this._supportedCommand(userInputCmdName)) {
      const helpCommand: CIHelpCommand = await getFromContainer(CIHelpCommand);
      return helpCommand.handler();
    }
  }

  private _supportedCommand(commandName: string): boolean {
    return this._commandsMap.has(commandName);
  }
}
