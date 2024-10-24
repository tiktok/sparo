import * as path from 'path';
import { inject } from 'inversify';
import { Service } from '../decorator';
import { GitService } from './GitService';
import { TerminalService } from './TerminalService';
import { SelectionParameterService } from './SelectionParameterService';
import { FileSystem, JsonFile, JsonSyntax } from '@rushstack/node-core-library';
import { Stopwatch } from '../logic/Stopwatch';

import type { ISelection } from '../logic/SparoProfile';
export interface IRushSparseCheckoutOptions {
  selections?: ISelection[];
  includeFolders?: string[];
  excludeFolders?: string[];
  to?: string[];
  from?: string[];
  checkoutAction?: 'add' | 'set' | 'purge' | 'skeleton';
}

export interface IRushProject {
  packageName: string;
  projectFolder: string;
}

@Service()
export class GitSparseCheckoutService {
  @inject(GitService) private _gitService!: GitService;
  @inject(TerminalService) private _terminalService!: TerminalService;
  @inject(SelectionParameterService) private _selectionParameterService!: SelectionParameterService;

  private _rushConfigLoaded: boolean = false;
  private _rushProjects: IRushProject[] = [];
  private _packageNames: Set<string> = new Set<string>();
  private _isSkeletonInitializedAndUpdated: boolean = false;
  private _finalSkeletonPaths: string[] = [];
  private _additionalSkeletonFolders: string[] = [];

  public ensureSkeletonExistAndUpdated(): void {
    /**
     * Every time sparo cli was invoked, _isInitialized will be reset to false and try to local and update skeleton if needed.
     * But it is not necessary to run initializeRepository() multiple times during a given command execution,
     * because there is no code changes and the result will be the same each time.
     *
     * @todo
     * Store isInitialized in local file, similar to LocalState, and check whether need to update skeleton
     * by checking if there is any code changes in rush.json, autoinstaller, or projects' package json
     */
    if (this._isSkeletonInitializedAndUpdated) {
      return;
    }

    if ('true' !== this._gitService.getGitConfig('core.sparsecheckout')?.trim()) {
      throw new Error('Sparse checkout is not enabled in this repo.');
    }
    this._initializeAndUpdateSkeleton();
  }

  /**
   * Other services should call ensureSkeletonExistAndUpdated
   */
  private _initializeAndUpdateSkeleton(): void {
    this._terminalService.terminal.writeLine('Checking out and updating core files...');
    this._loadRushConfiguration();
    this._prepareMonorepoSkeleton();
    this._isSkeletonInitializedAndUpdated = true;
  }

  public checkoutSkeletonAsync = async (): Promise<void> => {
    await this._rushSparseCheckoutAsync({ checkoutAction: 'skeleton' });
  };

  public async checkoutAsync({
    to,
    from,
    selections,
    includeFolders,
    excludeFolders,
    checkoutAction
  }: IRushSparseCheckoutOptions): Promise<void> {
    await this._rushSparseCheckoutAsync({
      to,
      from,
      selections,
      includeFolders,
      excludeFolders,
      checkoutAction
    });
  }

  public async purgeAsync(): Promise<void> {
    await this._rushSparseCheckoutAsync({ checkoutAction: 'purge' });
  }

  public setAdditionalSkeletonFolders(additionalSkeletonFolders: string[]): void {
    this._additionalSkeletonFolders = additionalSkeletonFolders;
  }

  /**
   *
   * @param options
   */
  private async _rushSparseCheckoutAsync(options: IRushSparseCheckoutOptions): Promise<void> {
    const {
      to,
      from,
      selections = [],
      includeFolders = [],
      excludeFolders = [],
      checkoutAction = 'add'
    } = options;

    const { terminal } = this._terminalService;

    // Check git repo
    if (
      'true' !==
      this._gitService
        .executeGitCommandAndCaptureOutput({
          args: ['rev-parse', '--is-inside-work-tree']
        })
        .trim()
    ) {
      throw new Error(`git repo not found. You should run this tool inside a git repo`);
    }

    this.ensureSkeletonExistAndUpdated();

    const fromSelectors: Set<string> = new Set();
    const toSelectors: Set<string> = new Set();

    if ('to' in options && to) {
      to.forEach((x) => {
        toSelectors.add(x);
      });
    }

    if ('from' in options && from) {
      from.forEach((x) => {
        fromSelectors.add(x);
      });
    }

    for (const selection of selections) {
      switch (selection.selector) {
        case '--to': {
          toSelectors.add(selection.argument);
          break;
        }
        case '--from': {
          fromSelectors.add(selection.argument);
          break;
        }
        default: {
          terminal.writeErrorLine(`Error, unknown selector ${selection.selector}`);
          break;
        }
      }
    }

    // Validate incorrect package names
    const unfoundedPackages: string[] = [];

    let additionalFullPackageNames: string[] = [];
    for (const selectorArg of toSelectors) {
      if (selectorArg.indexOf(':') < 0) {
        const packageName: string = selectorArg;
        const result: string | undefined = this._findProjectByShorthandName(packageName);
        if (!result) {
          unfoundedPackages.push(packageName);
        } else {
          // Ensure full package name used
          toSelectors.delete(packageName);
          // DO NOT add back to selectors in this loop
          additionalFullPackageNames.push(result);
        }
      }
    }
    for (const fullPackageName of additionalFullPackageNames) {
      toSelectors.add(fullPackageName);
    }
    additionalFullPackageNames = [];
    for (const selectorArg of fromSelectors) {
      if (selectorArg.indexOf(':') < 0) {
        const packageName: string = selectorArg;
        const result: string | undefined = this._findProjectByShorthandName(packageName);
        if (!result) {
          unfoundedPackages.push(packageName);
        } else {
          // Ensure full package name used
          fromSelectors.delete(packageName);
          // DO NOT add back to selectors in this loop
          additionalFullPackageNames.push(result);
        }
      }
    }
    for (const fullPackageName of additionalFullPackageNames) {
      fromSelectors.add(fullPackageName);
    }
    additionalFullPackageNames = [];

    if (unfoundedPackages.length > 0) {
      throw new Error(`These packages: ${unfoundedPackages.join(', ')} does not exist in rush.json`);
    }

    let targetFolders: string[] = [];

    if (toSelectors.size !== 0 || fromSelectors.size !== 0) {
      const stopwatch: Stopwatch = Stopwatch.start();
      targetFolders = this._selectionParameterService.getSelectedFolders({ toSelectors, fromSelectors });
      terminal.writeVerboseLine(`Get selected folders. (${stopwatch.toString()})`);
      stopwatch.stop();
    } else {
      terminal.writeDebugLine(
        'Skip getting selected folders regarding the absence of from selectors and to selectors'
      );
    }

    // include rule
    targetFolders.push(...includeFolders);

    // exclude rule, overrides everything
    const excludeSet: Set<string> = new Set<string>(excludeFolders);
    targetFolders = targetFolders.filter((folder) => !excludeSet.has(folder));

    {
      const stopwatch: Stopwatch = Stopwatch.start();
      /**
       * Perform different logic based on checkoutAction
       *
       *   "purge"  : reset repo to skeleton, will remove other paths in checkout paths list
       *
       * "skeleton" : checkout skeleton in repo, will only add skeleton paths to checkout paths list
       *
       *    "set"   : set checkout paths list by invoking "git sparse-checkout set", will implicitly add skeleton paths to this list.
       *
       *    "add"   : add a list of paths to checkout list by invoking "git sparse-checkout add"
       */
      switch (checkoutAction) {
        case 'purge':
          // re-apply the initial paths for setting up sparse repo state
          this._prepareMonorepoSkeleton({
            restore: checkoutAction === 'purge'
          });
          break;
        case 'skeleton':
          // Skeleton should be always prepared in the beginning of the function
          break;
        case 'add':
        case 'set':
          if (targetFolders.length === 0) {
            terminal.writeDebugLine(`Skip sparse checkout regarding no target folders`);
          } else {
            // if action is set, we need to combine targetFolder with _finalSkeletonPaths
            if (checkoutAction === 'set') {
              targetFolders.push(...this._finalSkeletonPaths);
            }
            terminal.writeLine(`Checking out ${targetFolders.length} folders...`);
            terminal.writeDebugLine(
              `Performing sparse checkout ${checkoutAction} for these folders: \n${targetFolders.join('\n')}`
            );

            this._sparseCheckoutPaths(targetFolders, {
              action: checkoutAction
            });
          }
          break;
        default:
          terminal.writeDebugLine(
            `Skip sparse checkout regarding unknown checkout action: ${checkoutAction}`
          );
          break;
      }
      terminal.writeLine(`Sparse checkout completed in ${stopwatch.toString()}`);
      stopwatch.stop();
    }
  }

  private _sparseCheckoutPaths(paths: string[], options: { action: 'set' | 'add' }): void {
    const { action } = options;
    const args: string[] = ['sparse-checkout', action].concat(paths);
    this._gitService.executeGitCommand({
      args
    });
  }

  private _loadRushConfiguration(): void {
    if (this._rushConfigLoaded) {
      return;
    }

    const rushJsonPath: string = path.resolve(this._monorepoRoot, 'rush.json');

    if (!FileSystem.exists(rushJsonPath)) {
      throw new Error('Missing rush.json. Do you work in a Rush.js monorepo?');
    }

    const { projects } = JsonFile.load(rushJsonPath, { jsonSyntax: JsonSyntax.JsonWithComments }) as {
      projects: IRushProject[];
    };

    this._rushConfigLoaded = true;

    projects.forEach((project) => {
      this._rushProjects.push(project);
      this._packageNames.add(project.packageName);
    });
  }

  private get _monorepoRoot(): string {
    const monorepoRoot: string = this._gitService.getRepoInfo().root;
    return monorepoRoot;
  }

  private _prepareMonorepoSkeleton(options: { restore?: boolean } = {}): void {
    const { restore } = options;
    this._finalSkeletonPaths = this._getSkeletonPaths();
    this._terminalService.terminal.writeLine('Checking out skeleton...');
    this._terminalService.terminal.writeDebugLine(`Skeleton paths: ${this._finalSkeletonPaths.join(', ')}`);
    this._sparseCheckoutPaths(this._finalSkeletonPaths, {
      action: restore ? 'set' : 'add'
    });
  }

  private _getSkeletonPaths(): string[] {
    const basicFolders: string[] = [
      '.vscode',
      'common',
      'common/sparse-profiles',
      'scripts',
      'plugins'
    ].concat(this._additionalSkeletonFolders);
    this._sparseCheckoutPaths(basicFolders, { action: 'add' });

    const pluginPaths: string[] = this._findRushPluginsPaths();
    // prepare all package.json for cone mode
    const packageJSON: string[] = [];
    for (const project of this._rushProjects) {
      /**
       * Example: git sparse checkout add apps/foo/subspace
       * Change to a sparse checkout with all files(at any depth)
       * under apps/foo/subspace plus all files immediately
       * under apps/ and apps/foo/ and the toplevel directory.
       */
      const curPath: string = `${project.projectFolder}/subspace`;
      packageJSON.push(curPath);
    }
    return basicFolders.concat(pluginPaths, packageJSON);
  }

  private _findRushPluginsPaths(): string[] {
    const autoInstallerPath: string = path.resolve(this._monorepoRoot, 'common', 'autoinstallers');
    const ignoreNames: Set<string> = new Set(['node_modules']);
    const rushPluginPaths: string[] = [];

    if (!FileSystem.exists(autoInstallerPath)) {
      // No rush autoinstallers defined
      return [];
    }

    if (!FileSystem.getStatistics(autoInstallerPath).isDirectory()) {
      throw new Error(
        `A non-directory path was put into the rush plugin scan process, please contact tool author`
      );
    }

    const dfsScan = (folderName: string): void => {
      if (!FileSystem.getStatistics(folderName).isDirectory()) {
        return;
      }

      const pathsUnderThisFolder: string[] = FileSystem.readFolderItemNames(folderName);

      for (const pathUnder of pathsUnderThisFolder) {
        if (ignoreNames.has(pathUnder)) continue;
        else if (pathUnder === 'package.json') {
          const { dependencies = {} } = JsonFile.load(path.resolve(folderName, pathUnder)) as {
            dependencies: { [key: string]: string };
          };

          for (const key of Object.keys(dependencies)) {
            const version: string = dependencies[key];
            if (version.indexOf('link:') === -1) continue;

            const splitPaths: string[] = version
              .substring(version.indexOf('link:') + 'link:'.length)
              .split('/');

            while (splitPaths.length && !/[A-Za-z]/.test(splitPaths[0][0])) splitPaths.shift();
            rushPluginPaths.push(splitPaths.join('/'));
          }
        } else {
          dfsScan(path.resolve(autoInstallerPath, folderName, pathUnder));
        }
      }
    };

    dfsScan(autoInstallerPath);
    return rushPluginPaths;
  }

  private _findProjectByShorthandName(shorthandPackageName: string): string | undefined {
    const { _packageNames: packageNames } = this;

    if (packageNames.has(shorthandPackageName)) {
      return shorthandPackageName;
    }

    let result: string | undefined;
    for (const packageName of packageNames) {
      if (this._getUnscopedName(packageName) === shorthandPackageName) {
        if (result) {
          return undefined;
        } else {
          result = packageName;
        }
      }
    }
    return result;
  }

  private _getUnscopedName(packageName: string): string {
    if (packageName[0] === '@') {
      const indexOfScopeSlash: number = packageName.indexOf('/');
      const unscopedName: string = packageName.slice(indexOfScopeSlash + 1);
      return unscopedName;
    }
    return packageName;
  }
}
