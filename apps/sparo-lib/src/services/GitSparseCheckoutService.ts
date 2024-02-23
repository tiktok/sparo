import * as path from 'path';
import * as child_process from 'child_process';
import { inject } from 'inversify';
import { Service } from '../decorator';
import { LocalState, LocalStateUpdateAction } from '../logic/LocalState';
import { type ISelection, SparoProfile } from '../logic/SparoProfile';
import { GitService } from './GitService';
import { SparoProfileService } from './SparoProfileService';
import { TerminalService } from './TerminalService';
import { Executable, FileSystem, JsonFile, JsonSyntax } from '@rushstack/node-core-library';
import { Stopwatch } from '../logic/Stopwatch';

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

export interface IResolveSparoProfileOptions {
  localStateUpdateAction: LocalStateUpdateAction;
}

@Service()
export class GitSparseCheckoutService {
  @inject(SparoProfileService) private _sparoProfileService!: SparoProfileService;
  @inject(GitService) private _gitService!: GitService;
  @inject(LocalState) private _localState!: LocalState;
  @inject(TerminalService) private _terminalService!: TerminalService;

  private _rushConfigLoaded: boolean = false;
  private _rushProjects: IRushProject[] = [];
  private _packageNames: Set<string> = new Set<string>();

  public initializeRepository(): void {
    this._terminalService.terminal.writeLine('Configuring skeleton...');

    if ('true' !== this._gitService.getGitConfig('core.sparsecheckout')?.trim()) {
      throw new Error('Sparse checkout is not enabled in this repo.');
    }

    this._loadRushConfiguration();
    this._prepareMonorepoSkeleton();
  }

  public async resolveSparoProfileAsync(
    profile: string,
    options: IResolveSparoProfileOptions
  ): Promise<{
    selections: ISelection[];
    includeFolders: string[];
    excludeFolders: string[];
  }> {
    this.initializeRepository();

    const sparoProfile: SparoProfile | undefined = await this._sparoProfileService.getProfileAsync(profile);

    if (!sparoProfile) {
      const availableProfiles: string[] = Array.from(
        (await this._sparoProfileService.getProfilesAsync()).keys()
      );
      throw new Error(
        `Parse sparse profile "${profile}" error. ${
          availableProfiles.length !== 0
            ? `Available profiles are:
${availableProfiles.join(',')}
`
            : 'No profiles now'
        }`
      );
    }

    const repositoryRoot: string | null = this._gitService.getRepoInfo().root;
    if (!repositoryRoot) {
      throw new Error(`Running outside of the git repository folder`);
    }

    const { selections, includeFolders, excludeFolders } = sparoProfile;
    const { localStateUpdateAction } = options;
    await this._localState.setProfiles(
      {
        [profile]: {
          selections,
          includeFolders,
          excludeFolders
        }
      },
      localStateUpdateAction
    );
    return {
      selections,
      includeFolders,
      excludeFolders
    };
  }

  public checkoutSkeletonAsync = async (): Promise<void> => {
    await this._rushSparseCheckoutAsync({ checkoutAction: 'skeleton' });
  };

  public async checkoutAsync({
    to,
    from,
    selections,
    includeFolders,
    excludeFolders
  }: Pick<
    IRushSparseCheckoutOptions,
    'to' | 'from' | 'selections' | 'includeFolders' | 'excludeFolders'
  >): Promise<void> {
    await this._rushSparseCheckoutAsync({
      to,
      from,
      selections,
      includeFolders,
      excludeFolders
    });
  }

  public async purgeAsync(): Promise<void> {
    await this._rushSparseCheckoutAsync({ checkoutAction: 'purge' });
  }

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

    {
      const stopwatch: Stopwatch = Stopwatch.start();
      this.initializeRepository();
      terminal.writeVerboseLine(`Initialize repo sparse checkout. (${stopwatch.toString()})`);
      stopwatch.stop();
    }

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

    const unfoundedPackages: string[] = [];
    for (const selector of [...toSelectors, ...fromSelectors]) {
      if (selector.indexOf(':') < 0) {
        const packageName: string = selector;
        const result: string | undefined = this._findProjectByShorthandName(packageName);
        if (!result) {
          unfoundedPackages.push(packageName);
        }
      }
    }

    if (unfoundedPackages.length > 0) {
      throw new Error(`These packages: ${unfoundedPackages.join(', ')} does not exist in rush.json`);
    }

    let targetFolders: string[] = [];

    if (toSelectors.size !== 0 || fromSelectors.size !== 0) {
      const stopwatch: Stopwatch = Stopwatch.start();
      targetFolders = this._getTargetFoldersByRushList({ toSelectors, fromSelectors });
      terminal.writeLine(`Run rush list command. (${stopwatch.toString()})`);
      stopwatch.stop();
    } else {
      terminal.writeDebugLine('Skip rush list regarding the absence of from selectors and to selectors');
    }

    // include rule
    targetFolders.push(...includeFolders);

    // exclude rule, overrides everything
    const excludeSet: Set<string> = new Set<string>(excludeFolders);
    targetFolders = targetFolders.filter((folder) => !excludeSet.has(folder));

    {
      const stopwatch: Stopwatch = Stopwatch.start();
      if (checkoutAction === 'purge') {
        // re-apply the initial paths for setting up sparse repo state
        this._prepareMonorepoSkeleton({ restore: true });
      }
      // FIXME: too long CLI parameter
      if (!(checkoutAction === 'purge' || checkoutAction === 'skeleton')) {
        if (targetFolders.length === 0) {
          terminal.writeDebugLine(`Skip sparse checkout regarding no target folders`);
        } else {
          terminal.writeLine(`Run sparse checkout for these folders: ${targetFolders.join(' ')}`);
          this._sparseCheckoutPaths(targetFolders, {
            action: 'add'
          });
        }
      }
      terminal.writeLine(`Sparse checkout target folders. (${stopwatch.toString()})`);
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

    const monorepoRoot: string = this._gitService.getRepoInfo().root;
    const rushJsonPath: string = path.resolve(monorepoRoot, 'rush.json');

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

  private _prepareMonorepoSkeleton(options: { restore?: boolean } = {}): void {
    const { restore } = options;
    const finalSkeletonPaths: string[] = this._getSkeletonPaths();
    this._terminalService.terminal.writeLine('Checking out skeleton...');
    this._sparseCheckoutPaths(finalSkeletonPaths, {
      action: restore ? 'set' : 'add'
    });
  }

  private _getSkeletonPaths(): string[] {
    const basicFolders: string[] = ['.vscode', 'common', 'common/sparse-profiles', 'scripts', 'plugins'];
    this._sparseCheckoutPaths(basicFolders, { action: 'add' });

    const pluginPaths: string[] = this._findRushPluginsPaths();
    // prepare all package.json for cone mode
    const packageJSON: string[] = [];
    for (const project of this._rushProjects) {
      const curPath: string = `${project.projectFolder}/_`;
      packageJSON.push(curPath);
    }
    return basicFolders.concat(pluginPaths, packageJSON);
  }

  private _findRushPluginsPaths(): string[] {
    const autoInstallerPath: string = path.resolve('common', 'autoinstallers');
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

  private _getTargetFoldersByRushList({
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
