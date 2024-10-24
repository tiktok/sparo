import * as child_process from 'child_process';
import { inject } from 'inversify';
import { Service } from '../decorator';
import { TerminalService } from './TerminalService';
import { Executable, JsonFile, Sort } from '@rushstack/node-core-library';
import { GitService } from './GitService';
import { RushProjectSlim } from '../logic/RushProjectSlim';

@Service()
export class SelectionParameterService {
  @inject(GitService) private _gitService!: GitService;
  @inject(TerminalService) private _terminalService!: TerminalService;

  public getSelectedFolders({
    toSelectors,
    fromSelectors
  }: {
    toSelectors: Iterable<string>;
    fromSelectors: Iterable<string>;
  }): string[] {
    let hasProtocolSelection: boolean = false;
    if (!hasProtocolSelection) {
      for (const toSelector of toSelectors) {
        if (toSelector.indexOf(':') >= 0) {
          hasProtocolSelection = true;
          break;
        }
      }
    }
    if (!hasProtocolSelection) {
      for (const fromSelector of fromSelectors) {
        if (fromSelector.indexOf(':') >= 0) {
          hasProtocolSelection = true;
          break;
        }
      }
    }

    if (!hasProtocolSelection) {
      this._terminalService.terminal.writeDebugLine(`Opt in strategy without running rush list`);
      // Selectors passed down here are ensured to contain full package names only
      return this._getSelectedFoldersByNamedProjectsOnly({
        toSelectors,
        fromSelectors
      });
    } else {
      return this._getSelectedFoldersByRushList({
        toSelectors,
        fromSelectors
      });
    }
  }

  /**
   * This function provides a quick way to get selected folders by
   * avoiding call "rush list" command
   */
  private _getSelectedFoldersByNamedProjectsOnly({
    toSelectors,
    fromSelectors
  }: {
    toSelectors: Iterable<string>;
    fromSelectors: Iterable<string>;
  }): string[] {
    let rushJson: { projects?: { packageName: string; projectFolder: string }[] } = {};
    const root: string = this._gitService.getRepoInfo().root;
    try {
      rushJson = JsonFile.load(`${root}/rush.json`);
    } catch (e) {
      // no-catch
    }

    const packageNameToRushProjectSlim: Map<string, RushProjectSlim> = new Map<string, RushProjectSlim>();
    if (Array.isArray(rushJson.projects)) {
      const { projects } = rushJson;
      for (const project of projects) {
        const rushProjectSlim: RushProjectSlim = new RushProjectSlim(
          project,
          root,
          packageNameToRushProjectSlim
        );
        packageNameToRushProjectSlim.set(project.packageName, rushProjectSlim);
      }
    }

    const selectedProjects: Set<RushProjectSlim> = new Set<RushProjectSlim>();
    const evalToSelectorForProject = (
      rushProjectSlim: RushProjectSlim,
      visited: Set<RushProjectSlim> = new Set<RushProjectSlim>()
    ): void => {
      if (visited.has(rushProjectSlim)) {
        return;
      }
      visited.add(rushProjectSlim);
      selectedProjects.add(rushProjectSlim);
      for (const dependencyProject of rushProjectSlim.dependencyProjects) {
        evalToSelectorForProject(dependencyProject, visited);
      }
    };
    for (const toSelector of toSelectors) {
      const rushProjectSlim: RushProjectSlim | undefined = packageNameToRushProjectSlim.get(toSelector);
      if (!rushProjectSlim) {
        throw new Error(`Can not found project definition for "${toSelector}"`);
      }
      evalToSelectorForProject(rushProjectSlim);
    }
    const evalFromSelectorForProject = (
      rushProjectSlim: RushProjectSlim,
      visited: Set<RushProjectSlim> = new Set<RushProjectSlim>()
    ): void => {
      if (visited.has(rushProjectSlim)) {
        return;
      }
      visited.add(rushProjectSlim);
      selectedProjects.add(rushProjectSlim);
      for (const dependencyProject of rushProjectSlim.dependencyProjects) {
        evalToSelectorForProject(dependencyProject);
      }
      for (const consumingProject of rushProjectSlim.consumingProjects) {
        evalFromSelectorForProject(consumingProject, visited);
      }
    };
    for (const fromSelector of fromSelectors) {
      const rushProjectSlim: RushProjectSlim | undefined = packageNameToRushProjectSlim.get(fromSelector);
      if (!rushProjectSlim) {
        throw new Error(`Can not found project definition for "${fromSelector}"`);
      }
      evalFromSelectorForProject(rushProjectSlim);
    }

    const { terminal } = this._terminalService;

    terminal.writeDebugLine(`Selected ${selectedProjects.size} projects:`);
    Sort.sortSetBy(selectedProjects, (x) => x.packageName);
    for (const project of selectedProjects) {
      terminal.writeDebugLine(project.packageName);
    }

    return Array.from(selectedProjects).map((x) => x.relativeProjectFolder);
  }

  private _getSelectedFoldersByRushList({
    toSelectors,
    fromSelectors
  }: {
    toSelectors: Iterable<string>;
    fromSelectors: Iterable<string>;
  }): string[] {
    const { terminal } = this._terminalService;

    const args: string[] = ['list', '--json'];

    for (const toSelector of toSelectors) {
      args.push('--to');
      args.push(toSelector);
    }
    for (const fromSelector of fromSelectors) {
      args.push('--from');
      args.push(fromSelector);
    }

    terminal.writeVerboseLine(`Run command: rush ${args.join(' ')}`);

    const result: child_process.SpawnSyncReturns<string> = Executable.spawnSync('rush', args, {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    if (result.status !== 0) {
      throw new Error(
        `Failed to evaluate the Sparo profile's project selectors:\nstdout: ${result.stdout}\nstderr: ${result.stderr}`
      );
    }

    const processedResult: string = this._processListResult(result.stdout.toString());

    terminal.writeVerboseLine(processedResult);

    const { projects: targetDeps } = JSON.parse(processedResult) as {
      projects: { path: string }[];
    };

    return targetDeps.map((targetDep) => targetDep.path);
  }

  private _processListResult(input: string): string {
    const stringList: string[] = input.split('\n');
    let endOfInstallScript: number = -1;

    for (let i: number = 0; i < stringList.length; ++i) {
      if (stringList[i][0] === '{') {
        endOfInstallScript = i;
        break;
      }
    }

    const jsonStringList: string[] = stringList.slice(endOfInstallScript);

    return jsonStringList.join('\n');
  }
}
