import 'reflect-metadata';
import { getFromContainer } from '../di/container';
import { GitService } from '../services/GitService';

/**
 * This class provides the useful function to check git version.
 */
export class GitVersionCompatibility {
  private constructor() {}

  public static async ensureGitVersionAsync(): Promise<void> {
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
}
