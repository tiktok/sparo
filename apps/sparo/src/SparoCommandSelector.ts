import * as path from 'path';

import { Sparo, type ILaunchOptions } from 'sparo-lib';

type CommandName = 'sparo' | 'sparo-ci' | undefined;

export class SparoCommandSelector {
  public static async executeAsync(): Promise<void> {
    const commandName: CommandName = SparoCommandSelector._getCommandName();
    const launchOptions: ILaunchOptions = {};
    switch (commandName) {
      case 'sparo-ci': {
        await Sparo.launchSparoCIAsync(launchOptions);
        break;
      }
      default: {
        await Sparo.launchSparoAsync(launchOptions);
        break;
      }
    }
  }

  private static _getCommandName(): CommandName {
    if (process.argv.length >= 2) {
      // Example:
      // argv[0]: "C:\\Program Files\\nodejs\\node.exe"
      // argv[1]: "C:\\Program Files\\nodejs\\node_modules\\sparo\\bin\\sparo"
      const basename: string = path.basename(process.argv[1]).toUpperCase();
      switch (basename) {
        case 'SPARO': {
          return 'sparo';
        }
        case 'SPARO-CI': {
          return 'sparo-ci';
        }
        default: {
          break;
        }
      }
    }
    return undefined;
  }
}
