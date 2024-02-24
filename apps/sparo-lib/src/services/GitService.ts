import * as child_process from 'child_process';
import { Executable } from '@rushstack/node-core-library';
import getRepoInfo, { type GitRepoInfo } from 'git-repo-info';
import { inject } from 'inversify';
import { Service } from '../decorator';
import { TerminalService } from './TerminalService';
import { Stopwatch } from '../logic/Stopwatch';
import { TelemetryService } from './TelemetryService';

/**
 * @alpha
 */
export interface IExecuteGitCommandParams {
  args: string[];
  workingDirectory?: string;
}

/**
 * Help class for git operations
 *
 * @alpha
 */
@Service()
export class GitService {
  private _checkedGitPath: boolean = false;
  private _gitPath: string | undefined;
  private _gitUser: string | undefined;
  private _gitEmail: string | undefined;
  private _isSparseCheckoutMode: boolean | undefined;
  @inject(TerminalService) private _terminalService!: TerminalService;
  @inject(TelemetryService) private _telemetryService!: TelemetryService;

  public setGitConfig(
    k: string,
    v: string | number | boolean,
    option?: { dryRun?: boolean; global?: boolean }
  ): void {
    const gitPath: string = this.getGitPathOrThrow();
    const currentWorkingDirectory: string = this.getRepoInfo().root;
    const { dryRun = false, global = false } = option ?? {};
    const args: string[] = [];

    args.push('config');
    if (global) {
      args.push('--global');
    }

    args.push(k, String(v));

    this._terminalService.terminal.writeDebugLine(`set git config with args ${JSON.stringify(args)}`);
    if (!dryRun) {
      const { status, stderr } = Executable.spawnSync(gitPath, args, {
        currentWorkingDirectory,
        stdio: 'inherit'
      });
      if (status !== 0) {
        throw new Error(`Error while setting git config: ${stderr}`);
      }
    }
  }

  public getGitConfig(k: string, option?: { dryRun?: boolean; global?: boolean }): string | undefined {
    const gitPath: string = this.getGitPathOrThrow();
    const currentWorkingDirectory: string = this.getRepoInfo().root;
    const { dryRun = false, global = false } = option ?? {};
    const args: string[] = [];
    args.push('config');
    if (global) {
      args.push('--global');
    }
    args.push(k);
    this._terminalService.terminal.writeDebugLine(`get git config with args ${JSON.stringify(args)}`);
    if (!dryRun) {
      const { stdout, status, stderr } = Executable.spawnSync(gitPath, args, {
        currentWorkingDirectory
      });
      // if no value exist, git will exit with error code 1 and no stderr and stdout
      if (status === 1 && stderr.length === 0 && stdout.length === 0) {
        return undefined;
      }
      if (status !== 0) {
        throw new Error(`Error while getting git config: ${stderr}`);
      }

      return stdout;
    }

    return undefined;
  }

  public setRecommendConfig(option?: { overwrite?: boolean; dryRun?: boolean }): void {
    const { overwrite = false, dryRun = false } = option ?? {};
    const recommendedConfigs: [string, string, number][] = [
      // ['config key','value','isGlobal']
      ['pull.rebase', 'true', 0],
      ['fetch.prune', 'true', 0],
      ['fetch.showForcedUpdates', 'false', 0],
      ['feature.manyFiles', 'true', 0],
      ['core.fsmonitor', 'true', 0],
      ['core.fscache', 'true', 0],
      ['core.untrackedcache', 'true', 0],
      ['om-my-zsh.hide-status', '1', 0],
      ['on-my-zsh.hide-dirty', '1', 0],
      ['lfs.allowincompletepush', 'true', 0],
      ['lfs.concurrenttransfers', '32', 0],
      ['push.autoSetupRemote', 'true', 0]
    ];

    const errors: string[] = [];
    let hasExistingConfig: boolean = false;
    for (const item of recommendedConfigs) {
      // check whether config exist
      const v: string | undefined = this.getGitConfig(item[0], { global: item[2] === 1, dryRun });
      this._terminalService.terminal.writeVerboseLine(`git config ${item[0]}=${v}`);
      if (v && !overwrite) {
        errors.push(`${item[0]}=${v}`);
        hasExistingConfig = true;
      }
    }
    if (hasExistingConfig && !overwrite) {
      throw new Error(`git config already exist: \n${errors.join('\n')}`);
    } else {
      for (const item of recommendedConfigs) {
        this.setGitConfig(item[0], item[1], { global: item[2] === 1, dryRun });
      }
    }

    /* enable git maintenance */
    this.executeGitCommand({ args: ['maintenance', 'register'] });
  }

  public getGitUser(): string | undefined {
    if (!this._gitUser) {
      const gitPath: string = this.getGitPathOrThrow();
      try {
        const { stdout, status } = Executable.spawnSync(gitPath, ['config', 'user.name'], { stdio: 'pipe' });
        if (status === 0) {
          this._gitUser = stdout.replace(/\n/g, '');
        }
      } catch (e) {
        // TODO: error handling
      }
    }
    return this._gitUser;
  }

  public getGitEmail(): string | undefined {
    if (!this._gitEmail) {
      const gitPath: string = this.getGitPathOrThrow();
      try {
        const { stdout, status } = Executable.spawnSync(gitPath, ['config', 'user.email'], { stdio: 'pipe' });
        if (status === 0) {
          this._gitEmail = stdout.replace(/\n/g, '');
        }
      } catch (e) {
        // TODO: error handling
      }
    }
    return this._gitEmail;
  }

  public getIsSparseCheckoutMode(): boolean | undefined {
    if (typeof this._isSparseCheckoutMode === 'undefined') {
      const gitPath: string = this.getGitPathOrThrow();
      try {
        const { status } = Executable.spawnSync(gitPath, ['sparse-checkout', 'list'], { stdio: 'pipe' });
        if (status === 0) {
          this._isSparseCheckoutMode = true;
        }
      } catch (e) {
        this._isSparseCheckoutMode = false;
      }
    }
    return this._isSparseCheckoutMode;
  }
  /**
   * Returns the path to the GitService binary if found. Otherwise, return undefined.
   */
  public get gitPath(): string | undefined {
    if (!this._checkedGitPath) {
      this._gitPath = Executable.tryResolve('git');
      this._checkedGitPath = true;
    }

    return this._gitPath;
  }

  public getGitPathOrThrow(): string {
    const gitPath: string | undefined = this.gitPath;
    if (!gitPath) {
      throw new Error('Git is not present');
    } else {
      return gitPath;
    }
  }

  public executeGitCommand({
    args,
    workingDirectory
  }: IExecuteGitCommandParams): child_process.SpawnSyncReturns<string> {
    const gitPath: string = this.getGitPathOrThrow();

    const currentWorkingDirectory: string = workingDirectory || this.getRepoInfo().root;

    this._terminalService.writeTaskHeader(`git ${args[0]}`);
    this._terminalService.terminal.writeDebugLine(`Invoking git command: ${gitPath} ${args.join(' ')}`);
    const stopwatch: Stopwatch = Stopwatch.start();
    const result: child_process.SpawnSyncReturns<string> = Executable.spawnSync(gitPath, args, {
      currentWorkingDirectory,
      stdio: 'inherit'
    });
    this._terminalService.terminal.writeDebugLine(`Invoked git command done (${stopwatch.toString()})`);
    this._terminalService.writeTaskFooter();
    stopwatch.stop();
    this._telemetryService.collectTelemetry({
      commandName: args[0],
      args: args.slice(1),
      durationInSeconds: stopwatch.duration,
      startTimestampMs: stopwatch.startTime,
      endTimestampMs: stopwatch.endTime,
      isRawGitCommand: true
    });
    return result;
  }

  public executeGitCommandAndCaptureOutput({ args, workingDirectory }: IExecuteGitCommandParams): string {
    const gitPath: string = this.getGitPathOrThrow();

    const currentWorkingDirectory: string = workingDirectory || this.getRepoInfo().root;

    this._terminalService.terminal.writeDebugLine(
      `Invoking git command and capture output: ${gitPath} ${args.join(' ')}`
    );
    const stopwatch: Stopwatch = Stopwatch.start();
    const result: child_process.SpawnSyncReturns<string> = Executable.spawnSync(gitPath, args, {
      currentWorkingDirectory,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    this._terminalService.terminal.writeDebugLine(`Invoked git command done (${stopwatch.toString()})`);
    stopwatch.stop();
    this._telemetryService.collectTelemetry({
      commandName: args[0],
      args: args.slice(1),
      durationInSeconds: stopwatch.duration,
      startTimestampMs: stopwatch.startTime,
      endTimestampMs: stopwatch.endTime,
      isRawGitCommand: true
    });
    this._processResult(result);
    return result.stdout.toString();
  }

  /**
   * Get the humanish basename from the URL
   *
   * The implementation aligns with the git source code at
   *   https://github.com/git/git/blob/3e0d3cd5c7def4808247caf168e17f2bbf47892b/dir.c#L3175
   */
  public getBasenameFromUrl(url: string): string {
    const len: number = url.length;
    let start: number = 0;
    let end: number = len;

    if (len === 0) {
      return '';
    }

    // Skip schema
    const schemaIndex: number = url.indexOf('://');
    if (schemaIndex >= 0) {
      start = schemaIndex + 3;
    }

    /*
     * Skip authentication data. The stripping does happen
     * greedily, such that we strip up to the last '@' inside
     * the host part.
     */
    for (let j: number = start; j < end && url[j] !== '/'; j++) {
      if (url[j] === '@') {
        start = j + 1;
      }
    }

    /*
     * Strip trailing spaces, slashes and /.git
     */
    while (start < end && (url[end - 1] === '/' || url[end - 1] === ' ')) {
      end -= 1;
    }
    if (end - start > 5 && url[end - 5] === '/' && url.slice(end - 4) === '.git') {
      end -= 5;
      while (start < end && url[end - 1] === '/') {
        end -= 1;
      }
    }

    if (end - start < 0) {
      throw new Error(`No directory name could be guessed.
Please specify a directory on the command line
`);
    }

    /**
     * Strip trailing port number
     */
    if (url.indexOf('/', start) < 0 && url.indexOf(':', start) >= 0) {
      let ptr: number = end;
      while (start < ptr && /^\d$/.test(url[ptr - 1]) && url[ptr - 1] !== ':') ptr--;
      if (start < ptr && url[ptr - 1] === ':') end = ptr - 1;
    }

    /*
     * Find last component. To remain backwards compatible we
     * also regard colons as path separators, such that
     * cloning a repository 'foo:bar.git' would result in a
     * directory 'bar' being guessed.
     */
    let ptr: number = end;
    while (start < ptr && url[ptr - 1] !== '/' && url[ptr - 1] !== ':') {
      ptr -= 1;
    }
    start = ptr;

    /*
     * Strip .git.
     */
    if (url.endsWith('.git')) {
      end -= 4;
    }

    let dir: string = url.slice(start, end);

    /**
     * Replace 'control' characters and whitespace with one ascii space
     */
    dir = dir.replace(/[\s\t\r\n]/, ' ');

    /**
     * Remove leading and trailing spaces
     */
    dir = dir.trim();

    return dir;
  }

  public getRepoInfo(): GitRepoInfo {
    return getRepoInfo();
  }

  public getBranchRemote(branch: string): string {
    const gitPath: string = this.getGitPathOrThrow();
    const { stdout, status } = Executable.spawnSync(gitPath, ['config', `branch.${branch}.remote`]);

    if (status === 1 && stdout.trim().length === 0) {
      // git config branch.<branch_name>.remote can't get correct remote in these two scenarios
      // 1. If target branch is not checked out locally.
      // 2. If target branch is a newly created local branch and not pushed to remote.
      // For these two scenarios, just return origin as default.
      return 'origin';
    } else if (status !== 0) {
      throw new Error(`Can't get remote for branch ${branch}`);
    }
    return stdout.trim();
  }

  public getGitVersion(): [number, number, number] | undefined {
    let result: [number, number, number] | undefined;

    const stdout: string = this.executeGitCommandAndCaptureOutput({
      args: ['--version']
    });

    const match: string[] | null = /(\d)+\.(\d+)\.(\d+)/.exec(stdout);
    if (match) {
      const [, major, minor, patch]: string[] = match;
      result = [parseInt(major, 10), parseInt(minor, 10), parseInt(patch, 10)];
    }
    this._terminalService.terminal.writeVerboseLine(
      `git version: ${Array.isArray(result) ? result.join('.') : 'unknown'}`
    );

    return result;
  }

  public hasFile(filename: string, branch: string): boolean {
    const result: string = this.executeGitCommandAndCaptureOutput({
      args: ['ls-tree', '--name-only', branch, filename]
    });
    return Boolean(result);
  }

  private _processResult(result: child_process.SpawnSyncReturns<string>): void {
    if (result.error) {
      result.error.message += '\n' + (result.stderr ? result.stderr.toString() + '\n' : '');
      throw result.error;
    }

    if (result.status) {
      throw new Error(
        'The command failed with exit code ' +
          result.status +
          '\n' +
          (result.stderr ? result.stderr.toString() : '')
      );
    }
  }
}
