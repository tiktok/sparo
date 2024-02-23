import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitService } from '../../services/GitService';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';
import { GitCloneService, ICloneOptions } from '../../services/GitCloneService';
import { Stopwatch } from '../../logic/Stopwatch';
import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ICommand } from './base';
import type { TerminalService } from '../../services/TerminalService';

export interface ICloneCommandOptions {
  full?: boolean;
  repository: string;
  directory?: string;
  skipGitConfig?: boolean;
}

@Command()
export class CloneCommand implements ICommand<ICloneCommandOptions> {
  public cmd: string = 'clone <repository> [directory]';
  public description: string = '';

  @inject(GitService) private _gitService!: GitService;
  @inject(GitCloneService) private _gitCloneService!: GitCloneService;
  @inject(GitSparseCheckoutService) private _GitSparseCheckoutService!: GitSparseCheckoutService;

  public builder(yargs: Argv<{}>): void {
    yargs
      .boolean('full')
      .positional('repository', {
        describe: 'The remote repository to clone from.',
        type: 'string'
      })
      .positional('directory', {
        describe:
          'The name of a new directory to clone into. The "humanish" part of the source repository is used if no directory is explicitly given (repo for /path/to/repo.gitService and foo for host.xz:foo/.gitService). Cloning into an existing directory is only allowed if the directory is empty',
        type: 'string'
      })
      .option('skip-git-config', {
        alias: 's',
        describe:
          'By default, Sparo automatically configures the recommended git settings for the repository you are about to clone. If you prefer not to include this step, you can use the input parameter --skip-git-config',
        default: false,
        type: 'boolean'
      })
      .check((argv) => {
        if (!argv.repository) {
          return 'You must specify a repository to clone.';
        }
        return true;
      });
  }

  public handler = async (
    args: ArgumentsCamelCase<ICloneCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { terminal } = terminalService;

    const directory: string = this._gitCloneService.resolveCloneDirectory(args);

    const cloneOptions: ICloneOptions = {
      ...args,
      directory: directory
    };

    terminal.writeLine('Initializing working directory...');
    const stopwatch: Stopwatch = Stopwatch.start();

    if (args.full) {
      this._gitCloneService.fullClone(cloneOptions);
      return;
    }

    this._gitCloneService.bloblessClone(cloneOptions);

    process.chdir(directory);

    await this._GitSparseCheckoutService.checkoutSkeletonAsync();

    // set recommended git config
    if (!args.skipGitConfig) {
      terminal.writeLine(`Setting up recommend configurations...`);
      this._gitService.setRecommendConfig({ overwrite: true });
    }

    terminal.writeLine(`Success: Working directory "${directory}" was prepared in ${stopwatch.toString()}`);
    stopwatch.stop();

    terminal.writeLine('Your next step is to choose a profile for checkout');
    terminal.writeLine('To see available profiles in this repo:');
    terminal.writeLine(`  cd ${directory}`);
    terminal.writeLine('  sparo list-profiles');
    terminal.writeLine('To checkout a profile:');
    terminal.writeLine(`  cd ${directory}`);
    terminal.writeLine('  sparo checkout --profile <profile_name>');
  };

  public getHelp(): string {
    return `clone help`;
  }
}
