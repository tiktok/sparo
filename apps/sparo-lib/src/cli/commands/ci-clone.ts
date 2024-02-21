import { inject } from 'inversify';
import { Command } from '../../decorator';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';
import { GitCloneService, ICloneOptions } from '../../services/GitCloneService';
import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ICommand } from './base';
import type { TerminalService } from '../../services/TerminalService';

export interface ICloneCommandOptions {
  full?: boolean;
  repository: string;
  directory?: string;
  dryRun?: boolean;
}

@Command()
export class CICloneCommand implements ICommand<ICloneCommandOptions> {
  public cmd: string = 'clone <repository> [directory]';
  public description: string = '';

  @inject(GitCloneService) private _gitCloneService!: GitCloneService;
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;

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
      .option('dryRun', {
        type: 'boolean',
        hidden: true,
        default: false
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

    if (args.full) {
      this._gitCloneService.fullClone(cloneOptions);
      return;
    }

    this._gitCloneService.treelessClone(cloneOptions);

    process.chdir(directory);
    await this._gitSparseCheckoutService.checkoutSkeletonAsync();

    terminal.writeLine(`Remember to run "cd ${directory}"`);
  };

  public getHelp(): string {
    return `clone help`;
  }
}
