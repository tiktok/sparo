import { Command } from '../../decorator';
import type { Argv } from 'yargs';
import type { ICommand } from './base';
import { ArgvService } from '../../services/ArgvService';
import { inject } from 'inversify';

export interface IHelpCommandOptions {}

@Command()
export class HelpCommand implements ICommand<IHelpCommandOptions> {
  public cmd: string = 'help';
  public description: string = '';

  @inject(ArgvService) private _yargs!: ArgvService;

  public builder(yargs: Argv<{}>): void {
    yargs.help(false);
  }

  public handler = async (): Promise<void> => {
    this._yargs.yargsArgv.showHelp();
  };

  public getHelp(): string {
    return '';
  }
}
