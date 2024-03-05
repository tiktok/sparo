import { FileSystem } from '@rushstack/node-core-library';
import type { Argv, ArgumentsCamelCase } from 'yargs';

import { Command } from '../../decorator';
import { TerminalService } from '../../services/TerminalService';
import { ICommand } from './base';
import { SparoProfileService } from '../../services/SparoProfileService';
import { inject } from 'inversify';
import { assetsFolderPath } from './util';
import { Colorize } from '@rushstack/terminal';

export interface IInitProjectCommandOptions {
  profile: string;
}

@Command()
export class InitProfileCommand implements ICommand<IInitProjectCommandOptions> {
  public cmd: string = 'init-profile';
  public description: string = 'Initialize a new profile.';

  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;
  @inject(TerminalService) private _terminalService!: TerminalService;

  public builder(yargs: Argv<IInitProjectCommandOptions>): void {
    yargs
      .option('profile', {
        type: 'string',
        description: 'The name of the profile to initialize.'
      })
      .demandOption(['profile'])
      .usage('Usage: $0 init-profile --profile <profile>');
  }

  public handler = async (
    args: ArgumentsCamelCase<IInitProjectCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { profile } = args;

    const destinationPath: string = this._sparoProfileService.getProfileFilepathByName(profile);

    if (this._sparoProfileService.hasProfileInFS(profile)) {
      throw new Error(
        `Error: A config file already exists for the profile name "${profile}":\n  ` + destinationPath
      );
    }

    const sparoProfileTemplateFilepath: string = `${assetsFolderPath}/sparo-profile.json`;

    if (!FileSystem.exists(sparoProfileTemplateFilepath)) {
      // THIS SHOULD NEVER HAPPEN
      throw new Error(`Unable to find sparo profile template file at ${sparoProfileTemplateFilepath}`);
    }

    await FileSystem.copyFileAsync({
      sourcePath: sparoProfileTemplateFilepath,
      destinationPath
    });
    this._terminalService.terminal.writeLine(
      Colorize.green(`Successfully initialized the "${profile}" profile.`)
    );
    this._terminalService.terminal.writeLine();
    this._terminalService.terminal.writeLine(
      'Next step: Open this file in your editor and configure the project selectors:'
    );
    this._terminalService.terminal.writeLine();
    this._terminalService.terminal.writeLine('  ' + Colorize.cyan(destinationPath));
  };

  public getHelp(): string {
    return 'init-profile help';
  }
}
