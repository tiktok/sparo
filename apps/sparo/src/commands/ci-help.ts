import { Command } from '../decorator';
import type { Argv } from 'yargs';
import type { ICommand } from './base';

export interface ICIHelpCommandOptions {}

@Command()
export class CIHelpCommand implements ICommand<ICIHelpCommandOptions> {
  public cmd: string = 'help';
  public description: string = '';

  public builder(yargs: Argv<ICIHelpCommandOptions>): void {
    yargs.command(
      'commands',
      'commands',
      () => {},
      () => {
        console.log('command help');
      }
    );
  }
  public async handler(): Promise<void> {
    console.log(`Sparo CI
usage: sparo-ci COMMAND [OPTIONS]
`);
  }
  public getHelp(): string {
    return '';
  }
}
