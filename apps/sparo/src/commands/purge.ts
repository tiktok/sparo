import { inject } from 'inversify';
import { type ArgumentsCamelCase } from 'yargs';

import { ICommand } from './base';
import { Command } from '../decorator';
import { GitSparseCheckoutService } from '../services/GitSparseCheckoutService';
import { LocalState } from '../logic/LocalState';

export interface ISparseCommandOptions {
  profile: string[];
}

@Command()
export class PurgeCommand implements ICommand<ISparseCommandOptions> {
  public cmd: string = 'purge';
  public description: string = '';
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;
  @inject(LocalState) private _localState!: LocalState;
  public builder(): void {
    // empty function
  }
  public handler = async (args: ArgumentsCamelCase<ISparseCommandOptions>): Promise<void> => {
    this._localState.reset();
    await this._gitSparseCheckoutService.purgeAsync();
  };
  public getHelp(): string {
    return 'sparse help';
  }
}
