import * as semver from 'semver';
import updateNotifier, { type UpdateNotifier } from 'update-notifier';
import { Colorize } from '@rushstack/terminal';
import { getFromContainer } from '../di/container';
import { TerminalService } from '../services/TerminalService';
import { SparoLibPackage } from '../logic/SparoLibPackage';
import { GitVersionCompatibility } from '../logic/GitVersionCompatibility';

/**
 * The package json information of the package who calls "sparo-lib".
 * @alpha
 */
export interface ICallerPackageJson {
  /**
   * Package name
   */
  name: string;
  /**
   * Package version
   */
  version: string;
}

export interface ILogBannerOptions {
  callerPackageJson?: ICallerPackageJson;
}

export class SparoStartupBanner {
  public static logBanner(options: ILogBannerOptions = {}): void {
    const sparoVersion: string = options.callerPackageJson?.version || SparoLibPackage.version;
    const gitVersion: string = GitVersionCompatibility.getGitVersion().join('.');
    const nodeVersion: string = this._formatNodeVersion();
    const { terminal } = getFromContainer(TerminalService);

    terminal.writeLine();
    terminal.writeLine(
      Colorize.bold(`Sparo accelerator for Git ${sparoVersion} -`) +
        Colorize.cyan(' https://tiktok.github.io/sparo/')
    );
    terminal.writeLine(`Node.js version is ${nodeVersion}`);
    terminal.writeLine(`Git version is ${gitVersion}`);
    terminal.writeLine();

    if (options.callerPackageJson && options.callerPackageJson.name && options.callerPackageJson.version) {
      // CLI parameter has not been processed yet, so directly go through parameters here.
      const isDebug: boolean = process.argv.includes('--debug');

      // Normally update-notifier waits a day or so before it starts displaying upgrade notices.
      // In debug mode, show the notice right away.
      const updateCheckInterval: number | undefined = isDebug ? 0 : undefined;

      // For development, uncomment these lines to force the updater to print a notice:
      //const updateCheckInterval: number = 0;
      //options.callerPackageJson = { ...options.callerPackageJson!, version: '0.0.1' };

      const notifier: UpdateNotifier = updateNotifier({
        pkg: options.callerPackageJson,
        updateCheckInterval
      });
      notifier.notify({
        // Make sure it says "-g" in the "npm install" example command line
        isGlobal: true,
        // Show the notice immediately, rather than waiting for process.onExit()
        defer: false
      });
      if (isDebug) {
        terminal.writeLine(Colorize.gray(`Notifier update: ${JSON.stringify(notifier.update)}`));
      }
    }
  }

  private static _formatNodeVersion(): string {
    const nodeVersion: string = process.versions.node;
    const nodeMajorVersion: number = semver.major(nodeVersion);
    const isOddNumberedVersion: boolean = nodeMajorVersion % 2 !== 0;
    const isLtsVersion: boolean = !!process.release.lts;
    const nodeReleaseLabel: string = isOddNumberedVersion ? 'unstable' : isLtsVersion ? 'LTS' : 'pre-LTS';
    return `${nodeVersion} (${nodeReleaseLabel})`;
  }
}
