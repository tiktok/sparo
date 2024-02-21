import { inject } from 'inversify';
import type { Argv, ArgumentsCamelCase } from 'yargs';
import { ICommand } from './base';
import { Command } from '../../decorator';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';

export interface ICISparseCommandOptions {
  to?: string[];
  from?: string[];
}

@Command()
export class CISparseCommand implements ICommand<ICISparseCommandOptions> {
  public cmd: string = 'sparse';
  public description: string = '';
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;
  public builder(yargs: Argv<ICISparseCommandOptions>): void {
    yargs
      .array('to')
      .array('from')
      .check((argv, options) => {
        const { to, from } = argv;
        const toNum: number = (to || []).length;
        const fromNum: number = (from || []).length;
        if (toNum === 0 && fromNum === 0) {
          throw new Error('At least one --to or --from must be specified');
        }
        return true;
      });
  }
  public handler = async (args: ArgumentsCamelCase<ICISparseCommandOptions>): Promise<void> => {
    const { to, from } = args;
    await this._gitSparseCheckoutService.checkoutAsync({
      to,
      from
    });
  };
  public getHelp(): string {
    return 'sparse help';
  }
}
