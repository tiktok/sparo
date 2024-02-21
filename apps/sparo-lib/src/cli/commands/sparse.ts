import { inject } from 'inversify';
import type { Argv, ArgumentsCamelCase } from 'yargs';
import { ICommand } from './base';
import { Command } from '../../decorator';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';

export interface ISparseCommandOptions {
  profile: string[];
}

@Command()
export class SparseCommand implements ICommand<ISparseCommandOptions> {
  public cmd: string = 'sparse';
  public description: string = '';
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;
  public builder(yargs: Argv<ISparseCommandOptions>): void {
    yargs.array('profile').demandOption(['profile']);
  }
  public handler = async (args: ArgumentsCamelCase<ISparseCommandOptions>): Promise<void> => {
    const { profile } = args;

    for (const p of profile) {
      const { selections, includeFolders, excludeFolders } =
        await this._gitSparseCheckoutService.resolveSparseProfileAsync(p, {
          localStateUpdateAction: 'add'
        });
      // TODO: policy #1: Can not sparse checkout with uncommitted changes in the cone.

      await this._gitSparseCheckoutService.checkoutAsync({
        selections,
        includeFolders,
        excludeFolders
      });
    }
  };
  public getHelp(): string {
    return 'sparse help';
  }
}
