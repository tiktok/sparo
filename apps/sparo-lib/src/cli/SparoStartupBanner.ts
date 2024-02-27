import * as semver from 'semver';
import { Colorize } from '@rushstack/terminal';
import { getFromContainer } from '../di/container';
import { TerminalService } from '../services/TerminalService';
import { SparoVersion } from '../logic/SparoVersion';
import { GitVersionCompatibility } from '../logic/GitVersionCompatibility';

export class SparoStartupBanner {
  public static logBanner(): void {
    const sparoVersion: string = SparoVersion.version;
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
