import { Command } from '../../decorator';
import type { Argv } from 'yargs';
import type { ICommand } from './base';

export interface IHelpCommandOptions {}

@Command()
export class HelpCommand implements ICommand<IHelpCommandOptions> {
  public cmd: string = 'help';
  public description: string = '';
  private _yargs: Argv<IHelpCommandOptions> | undefined;

  public builder = (yargs: Argv<IHelpCommandOptions>): void => {
    this._yargs = yargs;
  };
  public handler = async (): Promise<void> => {
    this._yargs?.showHelp();
  };
  public getHelp(): string {
    return '';
  }
}
