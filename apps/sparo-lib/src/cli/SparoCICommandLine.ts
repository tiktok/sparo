import 'reflect-metadata';
import { getFromContainerAsync, registerClass } from '../di/container';
import { CommandService } from '../services/CommandService';
import { CI_COMMAND_LIST } from './commands/cmd-list';
import { ICommand } from './commands/base';
import { ArgvService } from '../services/ArgvService';
import { GitVersionCompatibility } from '../logic/GitVersionCompatibility';
import { TelemetryService } from '../services/TelemetryService';
import { GitSparseCheckoutService } from '../services/GitSparseCheckoutService';
import { getCommandName } from './commands/util';
import { SparoStartupBanner } from './SparoStartupBanner';
import type { ILaunchOptions } from '../api/Sparo';

export class SparoCICommandLine {
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

    if (launchOptions.additionalSkeletonFolders) {
      const gitSparseCheckoutService: GitSparseCheckoutService =
        await getFromContainerAsync(GitSparseCheckoutService);
      gitSparseCheckoutService.setAdditionalSkeletonFolders(launchOptions.additionalSkeletonFolders);
    }

    const sparoCI: SparoCICommandLine = new SparoCICommandLine();
    await sparoCI.prepareCommandAsync();
    await sparoCI.runAsync();
  }

  public async prepareCommandAsync(): Promise<void> {
    const commandsService: CommandService = await getFromContainerAsync(CommandService);

    await Promise.all(
      CI_COMMAND_LIST.map(async (cmd): Promise<void> => {
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
    if (!userInputCmdName || !this._supportedCommand(userInputCmdName)) {
      argv.yargsArgv.showHelp();
      return;
    }
  }

  private _supportedCommand(commandName: string): boolean {
    return this._commandsMap.has(commandName);
  }
}
