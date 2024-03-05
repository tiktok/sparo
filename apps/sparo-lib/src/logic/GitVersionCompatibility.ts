import 'reflect-metadata';
import { getFromContainer } from '../di/container';
import { GitService } from '../services/GitService';
import { TerminalService } from '../services/TerminalService';

/**
 * This class provides the useful function to check git version.
 */
export class GitVersionCompatibility {
  private static _gitVersion: [number, number, number] | undefined;

  private constructor() {}

  public static reportGitRequiredVersion(): boolean {
    const [major, minor, patch] = GitVersionCompatibility.getGitVersion();
    if (major < 2 || minor < 44) {
      const terminalService: TerminalService = getFromContainer(TerminalService);
      terminalService.terminal.writeErrorLine(
        `It appears your Git version(${major}.${minor}.${patch}) is too old. The minimal supported version is >=2.44.0.\nPlease upgrade to the latest Git version. Many Git optimizations are relatively new and not available in older versions of the software.`
      );
      return true;
    }

    return false;
  }

  public static getGitVersion(): [number, number, number] {
    if (!GitVersionCompatibility._gitVersion) {
      const gitService: GitService = getFromContainer(GitService);
      const gitVersion: [number, number, number] | undefined = gitService.getGitVersion();
      if (!gitVersion) {
        throw new Error(`Fail to detect Git version`);
      }
      GitVersionCompatibility._gitVersion = gitVersion;
    }
    return GitVersionCompatibility._gitVersion as [number, number, number];
  }
}
