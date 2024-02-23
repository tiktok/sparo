import { FileSystem } from '@rushstack/node-core-library';
import type { Argv, ArgumentsCamelCase } from 'yargs';

import { Command } from '../../decorator';
import { TerminalService } from '../../services/TerminalService';
import { ICommand } from './base';
import { SparoProfileService } from '../../services/SparoProfileService';
import { inject } from 'inversify';
import { assetsFolderPath } from './util';

export interface IInitProjectCommandOptions {
  profile: string;
}

@Command()
export class InitProfileCommand implements ICommand<IInitProjectCommandOptions> {
  public cmd: string = 'init-profile';
  public description: string = 'Initialize a new profile.';

  // template section name --> whether it should be commented out
  private _commentedBySectionName: Map<string, boolean> = new Map<string, boolean>();

  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;
  @inject(TerminalService) private _terminalService!: TerminalService;

  public builder(yargs: Argv<IInitProjectCommandOptions>): void {
    yargs.string('profile').demandOption(['profile']);
  }

  public handler = async (
    args: ArgumentsCamelCase<IInitProjectCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { profile } = args;

    if (this._sparoProfileService.hasProfileInFS(profile)) {
      throw new Error(`${profile} has already existed`);
    }

    const sparoProfileTemplateFilepath: string = `${assetsFolderPath}/sparo-profile.json`;

    if (!FileSystem.exists(sparoProfileTemplateFilepath)) {
      // THIS SHOULD NEVER HAPPEN
      throw new Error(`Unable to find sparo profile template file at ${sparoProfileTemplateFilepath}`);
    }

    const destinationPath: string = this._sparoProfileService.getProfileFilepathByName(profile);

    await FileSystem.copyFileAsync({
      sourcePath: sparoProfileTemplateFilepath,
      destinationPath
    });
    this._terminalService.terminal.writeLine(`Generate sparo profile: ${destinationPath}`);
  };

  public getHelp(): string {
    return 'init-profile help';
  }
}
