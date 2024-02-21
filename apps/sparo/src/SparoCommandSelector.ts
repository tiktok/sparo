import * as path from 'path';
import 'reflect-metadata';

import { Sparo } from './api/Sparo';
import { SparoCI } from './api/SparoCI';
import { GitService } from './services/GitService';
import { getFromContainer } from './di/container';

type CommandName = 'sparo' | 'sparo-ci' | undefined;

export class SparoCommandSelector {
  public static async executeAsync(): Promise<void> {
    await SparoCommandSelector._ensureGitVersionAsync();

    const commandName: CommandName = SparoCommandSelector._getCommandName();
    switch (commandName) {
      case 'sparo-ci': {
        await SparoCI.launchAsync();
        break;
      }
      default: {
        await Sparo.launchAsync();
      }
    }
  }

  private static async _ensureGitVersionAsync(): Promise<void> {
    const gitService: GitService = await getFromContainer(GitService);
    const gitVersion: [number, number, number] | undefined = gitService.getGitVersion();
    if (!gitVersion) {
      throw new Error(`Fail to get git version`);
    }

    const [major, minor, patch] = gitVersion;
    if (major < 2 || minor < 32) {
      throw new Error(
        `git version is too low. The minimal git version is >=2.32.0. Your git version is ${major}.${minor}.${patch}. Please upgrade git.`
      );
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
