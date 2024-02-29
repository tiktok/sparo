import { inject } from 'inversify';
import type { Argv, ArgumentsCamelCase } from 'yargs';
import { ICommand } from './base';
import { Command } from '../../decorator';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';

export interface ICICheckoutCommandOptions {
  to?: string[];
  from?: string[];
}

@Command()
export class CICheckoutCommand implements ICommand<ICICheckoutCommandOptions> {
  public cmd: string = 'checkout';
  public description: string =
    'Special checkout command for CI. It only accepts project selector suchs as --to and --from now.';
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;
  public builder(yargs: Argv<ICICheckoutCommandOptions>): void {
    yargs
      .option('to', {
        type: 'array',
        alias: 't',
        description: 'See https://rushjs.io/pages/developer/selecting_subsets/#--to for more details.'
      })
      .option('from', {
        type: 'array',
        alias: 'f',
        description: 'See https://rushjs.io/pages/developer/selecting_subsets/#--from for more details.'
      })
      .check((argv, options) => {
        const { to, from } = argv;
        const toNum: number = (to || []).length;
        const fromNum: number = (from || []).length;
        if (toNum === 0 && fromNum === 0) {
          throw new Error('At least one of "--to" or "--from" must be specified');
        }
        return true;
      });
  }
  public handler = async (args: ArgumentsCamelCase<ICICheckoutCommandOptions>): Promise<void> => {
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
