import 'reflect-metadata';
import { getFromContainer } from '../di/container';
import { GitService } from '../services/GitService';

/**
 * This class provides the useful function to check git version.
 */
export class GitVersionCompatibility {
  private static _gitVersion: [number, number, number] | undefined;

  private constructor() {}

  public static ensureGitVersion(): void {
    const [major, minor, patch] = GitVersionCompatibility.getGitVersion();
    if (major < 2 || minor < 32) {
      throw new Error(
        `git version is too low. The minimal git version is >=2.32.0. Your git version is ${major}.${minor}.${patch}. Please upgrade git.`
      );
    }
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
