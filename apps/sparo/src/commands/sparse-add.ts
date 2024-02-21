import { inject } from 'inversify';
import type { Argv, ArgumentsCamelCase } from 'yargs';
import { ICommand } from './base';

import { Command } from '../decorator';
import { GitSparseCheckoutService } from '../services/GitSparseCheckoutService';

export interface ISparseCommandOptions {
  profile: string;
}

@Command()
export class SparseAddCommand implements ICommand<ISparseCommandOptions> {
  public cmd: string = 'sparse-add';
  public description: string = '';
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;

  public builder(yargs: Argv<ISparseCommandOptions>): void {
    yargs.string('profile').demandOption(['profile']);
  }
  public handler = async (args: ArgumentsCamelCase<ISparseCommandOptions>): Promise<void> => {
    const { profile } = args;

    const { selections, includeFolders, excludeFolders } =
      await this._gitSparseCheckoutService.resolveSparseProfileAsync(profile, {
        localStateUpdateAction: 'add'
      });
    // TODO: policy #1: Can not sparse checkout with uncommitted changes in the cone.

    await this._gitSparseCheckoutService.checkoutAsync({
      selections,
      includeFolders,
      excludeFolders
    });
  };
  public getHelp(): string {
    return 'sparse help';
  }
}
