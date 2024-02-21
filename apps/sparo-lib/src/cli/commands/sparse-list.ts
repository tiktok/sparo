import childProcess from 'child_process';
import type { Argv, ArgumentsCamelCase } from 'yargs';
import { SparoProfileService } from '../../services/SparoProfileService';
import { ICommand } from './base';
import { Command } from '../../decorator';
import { inject } from 'inversify';
import { GitSparseCheckoutService } from '../../services/GitSparseCheckoutService';
import type { TerminalService } from '../../services/TerminalService';

export interface IProject {
  name: string;
  path: string;
}
export interface ISparseListCommandOptions {
  project: string;
}

@Command()
export class SparseListCommand implements ICommand<ISparseListCommandOptions> {
  public cmd: string = 'sparse-list';
  public description: string = '';
  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;

  public builder(yargs: Argv<ISparseListCommandOptions>): void {
    yargs.string('project').demandOption(['project']);
  }
  public handler = async (
    args: ArgumentsCamelCase<ISparseListCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    // ensure sparse profiles folder
    this._gitSparseCheckoutService.initializeRepository();

    const profileProjects: Map<string, string[]> = new Map<string, string[]>();
    for (const [profileName, sparoProfile] of await this._sparoProfileService.getProfilesAsync()) {
      const { toSelectors, fromSelectors } = sparoProfile.rushSelectors;
      const rushListCmd: string = `rush list --json ${Array.from(toSelectors)
        .map((x) => `--to ${x}`)
        .join(' ')} ${Array.from(fromSelectors)
        .map((x) => `--from ${x}`)
        .join(' ')} `;
      const res: { projects: IProject[] } = JSON.parse(childProcess.execSync(rushListCmd).toString());
      for (const project of res.projects) {
        if (profileProjects.has(project.name)) {
          const profiles: string[] | undefined = profileProjects.get(project.name);
          profiles?.push(profileName);
        } else {
          profileProjects.set(project.name, [profileName]);
        }
      }
    }

    const { project } = args;
    if (profileProjects.has(project)) {
      terminalService.terminal.writeLine(
        `${project} was included in the below profiles:\n ${profileProjects.get(project)?.join('\n')}`
      );
    } else {
      terminalService.terminal.writeErrorLine(`${project} is not included in any pre-configured profile`);
    }
  };
  public getHelp(): string {
    return 'sparse list help';
  }
}
