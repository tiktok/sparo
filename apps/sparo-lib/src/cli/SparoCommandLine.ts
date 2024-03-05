import 'reflect-metadata';
import { getFromContainerAsync, registerClass } from '../di/container';
import { GitService } from '../services/GitService';
import { CommandService } from '../services/CommandService';
import { ArgvService } from '../services/ArgvService';
import { COMMAND_LIST } from './commands/cmd-list';
import { ICommand } from './commands/base';
import { GitVersionCompatibility } from '../logic/GitVersionCompatibility';
import { TelemetryService } from '../services/TelemetryService';
import { getCommandName } from './commands/util';
import { SparoStartupBanner } from './SparoStartupBanner';
import type { ILaunchOptions } from '../api/Sparo';

export class SparoCommandLine {
  private _commandsMap: Set<string> = new Set<string>();

  private constructor() {}

  public static async launchAsync(launchOptions: ILaunchOptions): Promise<void> {
    if (launchOptions.collectTelemetryAsync) {
      const telemetryService: TelemetryService = await getFromContainerAsync(TelemetryService);
      telemetryService.setCollectTelemetryFunction(launchOptions.collectTelemetryAsync);
    }

    if (GitVersionCompatibility.reportGitRequiredVersion()) {
      process.exit(1);
    }
    SparoStartupBanner.logBanner({
      callerPackageJson: launchOptions.callerPackageJson
    });

    const sparo: SparoCommandLine = new SparoCommandLine();
    await sparo.prepareCommandAsync();
    await sparo.runAsync();
  }

  public async prepareCommandAsync(): Promise<void> {
    const commandsService: CommandService = await getFromContainerAsync(CommandService);

    await Promise.all(
      COMMAND_LIST.map(async (cmd): Promise<void> => {
        registerClass(cmd);
        const cmdInstance: ICommand<{}> = await getFromContainerAsync(cmd);
        commandsService.register(cmdInstance);
        this._commandsMap.add(getCommandName(cmdInstance.cmd));
      })
    );
  }

  public async runAsync(): Promise<void> {
    const argv: ArgvService = await getFromContainerAsync(ArgvService);
    await argv.parseArgvAsync();
    const userInputCmdName: string = argv.getUserCommand();
    if (!userInputCmdName) {
      argv.yargsArgv.showHelp();
      return;
    }

    // proxy to gitService
    if (!this._supportedCommand(userInputCmdName)) {
      const gitService: GitService = await getFromContainerAsync(GitService);
      const args: string[] = argv.stripSparoArgs(process.argv.slice(2));
      gitService.executeGitCommand({
        args
      });
    }
  }

  private _supportedCommand(commandName: string): boolean {
    return this._commandsMap.has(commandName);
  }
}
