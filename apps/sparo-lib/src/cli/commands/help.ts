import { Command } from '../../decorator';
import { Argv } from 'yargs';
import type { ICommand } from './base';

export interface IHelpCommandOptions {}

@Command()
export class HelpCommand implements ICommand<IHelpCommandOptions> {
  public cmd: string = 'help';
  public description: string = '';

  public builder(yargs: Argv<IHelpCommandOptions>): void {
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
    console.log(`Sparo
usage: sparo COMMAND [OPTIONS]
`);
  }
  public getHelp(): string {
    return '';
  }
}
