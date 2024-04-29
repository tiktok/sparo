import { FileSystem, Async } from '@rushstack/node-core-library';
import path from 'path';
import { inject } from 'inversify';
import { Service } from '../decorator';
import { SparoProfile, ISelection, ISparoProfileJson } from '../logic/SparoProfile';
import { TerminalService } from './TerminalService';
import { GitService } from './GitService';
import { GitSparseCheckoutService } from './GitSparseCheckoutService';
import { LocalState, ILocalStateProfiles, type LocalStateUpdateAction } from '../logic/LocalState';

export interface ISparoProfileServiceParams {
  terminalService: TerminalService;
  sparoProfileFolder: string;
}

export interface IResolveSparoProfileOptions {
  localStateUpdateAction: LocalStateUpdateAction;
}

const defaultSparoProfileFolder: string = 'common/sparo-profiles';
const INTERNAL_RUSH_SELECTOR_PSEUDO_PROFILE: string = '__INTERNAL_RUSH_SELECTOR_PSEUDO_PROFILE__';

@Service()
export class SparoProfileService {
  public _profiles: Map<string, SparoProfile> = new Map<string, SparoProfile>();
  private _loadPromise: Promise<void> | undefined;

  @inject(GitService) private _gitService!: GitService;
  @inject(TerminalService) private _terminalService!: TerminalService;
  @inject(LocalState) private _localState!: LocalState;
  @inject(GitSparseCheckoutService) private _gitSparseCheckoutService!: GitSparseCheckoutService;

  public async loadProfilesAsync(): Promise<void> {
    if (!this._loadPromise) {
      this._loadPromise = (async () => {
        const sparoProfileFolder: string = this._sparoProfileFolder;
        this._terminalService.terminal.writeDebugLine(
          'loading sparse profiles from folder:',
          sparoProfileFolder
        );
        const sparoProfilePaths: string[] = await FileSystem.readFolderItemNamesAsync(sparoProfileFolder, {
          absolutePaths: true
        });

        await Async.forEachAsync(sparoProfilePaths, async (sparoProfilePath: string) => {
          if (path.extname(sparoProfilePath) !== '.json') {
            // No need to handle non-JSON files.
            return;
          }
          let sparoProfile: SparoProfile | undefined;
          try {
            sparoProfile = await SparoProfile.loadFromFileAsync(this._terminalService, sparoProfilePath);
          } catch (e) {
            this._terminalService.terminal.writeErrorLine(
              `Failed to load sparo profile from ${sparoProfilePath}`
            );
            this._terminalService.terminal.writeDebugLine((e as Error).message);
          }

          if (sparoProfile) {
            const profileName: string = SparoProfileService._getProfileName(sparoProfilePath);
            this._terminalService.terminal.writeDebugLine(
              `load sparse profile ${profileName} from ${sparoProfilePath}`
            );
            this._profiles.set(profileName, sparoProfile);
          }
        });
      })();
    }
    return this._loadPromise;
  }

  public async getProfileAsync(name: string): Promise<SparoProfile | undefined> {
    await this.loadProfilesAsync();
    return this._profiles.get(name);
  }

  public async getProfilesAsync(): Promise<Map<string, SparoProfile>> {
    await this.loadProfilesAsync();
    return this._profiles;
  }

  public hasProfileInGit(name: string, branch: string): boolean {
    return this._gitService.hasFile(`${defaultSparoProfileFolder}/${name}.json`, branch);
  }

  public hasProfileInFS(name: string): boolean {
    const sparoProfileFilepath: string = path.resolve(this._sparoProfileFolder, `${name}.json`);
    return FileSystem.exists(sparoProfileFilepath);
  }

  private get _sparoProfileFolder(): string {
    const repoRoot: string = this._gitService.getRepoInfo().root;
    if (!repoRoot) {
      throw new Error(`Failed to detect git repository. Please check running in a git repository folder.`);
    }
    const sparoProfileFolder: string = path.resolve(repoRoot, defaultSparoProfileFolder);
    return sparoProfileFolder;
  }

  /**
   * Returns the absolute file path where the specified profile name would be stored.
   * @remarks
   * It is not guaranteed that the file actually exists.
   */
  public getProfileFilepathByName(profileName: string): string {
    return path.resolve(this._sparoProfileFolder, `${profileName}.json`);
  }

  private static _getProfileName(profilePath: string): string {
    const parsed: path.ParsedPath = path.parse(profilePath);
    return parsed.name;
  }

  public async resolveSparoProfileAsync(
    profile: string,
    options: IResolveSparoProfileOptions
  ): Promise<{
    selections: ISelection[];
    includeFolders: string[];
    excludeFolders: string[];
  }> {
    this._gitSparseCheckoutService.ensureSkeletonExistAndUpdated();
    const sparoProfile: SparoProfile | undefined = await this.getProfileAsync(profile);

    if (!sparoProfile) {
      const availableProfiles: string[] = Array.from((await this.getProfilesAsync()).keys());
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

  /**
   * preprocess profile related args from CLI parameter
   */
  public async preprocessProfileArgs({
    profilesFromArg,
    addProfilesFromArg
  }: {
    profilesFromArg: string[];
    addProfilesFromArg: string[];
  }): Promise<{
    isNoProfile: boolean;
    isProfileRestoreFromLocal: boolean;
    profiles: Set<string>;
    addProfiles: Set<string>;
  }> {
    let isNoProfile: boolean = false;
    let isProfileRestoreFromLocal: boolean = false;
    /**
     * --profile is defined as array type parameter, specifying --no-profile is resolved to false by yargs.
     *
     * @example --no-profile -> [false]
     * @example --no-profile --profile foo -> [false, "foo"]
     * @example --profile foo --no-profile -> ["foo", false]
     */
    const profiles: Set<string> = new Set();

    for (const profile of profilesFromArg) {
      if (typeof profile === 'boolean' && profile === false) {
        isNoProfile = true;
        continue;
      }

      profiles.add(profile);
    }

    /**
     * --add-profile is defined as array type parameter
     * @example --no-profile --add-profile foo -> throw error
     * @example --profile bar --add-profile foo -> current profiles = bar + foo
     * @example --add-profile foo -> current profiles = current profiles + foo
     */
    const addProfiles: Set<string> = new Set(addProfilesFromArg.filter((p) => typeof p === 'string'));

    if (isNoProfile && (profiles.size || addProfiles.size)) {
      throw new Error(`The "--no-profile" parameter cannot be combined with "--profile" or "--add-profile"`);
    }

    //
    if (!isNoProfile && profiles.size === 0) {
      // Get target profile.
      // 1. If profile specified from CLI parameter, preferential use it.
      // 2. If none profile specified, read from existing profile from local state as default.
      const localStateProfiles: ILocalStateProfiles | undefined = await this._localState.getProfiles();
      isProfileRestoreFromLocal = true;
      if (localStateProfiles) {
        Object.keys(localStateProfiles).forEach((p) => {
          if (p === INTERNAL_RUSH_SELECTOR_PSEUDO_PROFILE) return;
          profiles.add(p);
        });
      }
    }
    return {
      isNoProfile,
      profiles,
      addProfiles,
      isProfileRestoreFromLocal
    };
  }

  private async _syncRushSelectors(): Promise<ISelection[]>;
  private async _syncRushSelectors(selections: ISelection[]): Promise<void>;
  private async _syncRushSelectors(selections?: ISelection[]): Promise<void | ISelection[]> {
    if (typeof selections !== 'undefined') {
      return this._localState.setProfiles(
        {
          [INTERNAL_RUSH_SELECTOR_PSEUDO_PROFILE]: {
            selections
          }
        },
        'add'
      );
    } else {
      const localStateProfiles: ILocalStateProfiles | undefined = await this._localState.getProfiles();
      if (localStateProfiles) {
        const rushSelectorProfiles: ISparoProfileJson | undefined =
          localStateProfiles[INTERNAL_RUSH_SELECTOR_PSEUDO_PROFILE];
        return rushSelectorProfiles?.selections || [];
      }
      return [];
    }
  }

  /**
   * sync local sparse checkout state with specified profiles
   */
  public async syncProfileState({
    profiles,
    addProfiles,
    fromProjects,
    toProjects,
    isProfileRestoreFromLocal
  }: {
    profiles?: Set<string>;
    addProfiles?: Set<string>;
    fromProjects?: Set<string>;
    toProjects?: Set<string>;
    isProfileRestoreFromLocal?: boolean;
  }): Promise<void> {
    // only if user didn't specify any profile during a sparo checkout, we need to
    // retain any previously checked out projects based on Rush Selectors
    // https://rushjs.io/pages/developer/selecting_subsets/
    const rushSelectorState: ISelection[] = isProfileRestoreFromLocal ? await this._syncRushSelectors() : [];
    this._localState.reset();
    const allProfiles: string[] = Array.from([...(profiles ?? []), ...(addProfiles ?? [])]);
    if (allProfiles.length > 1) {
      this._terminalService.terminal.writeLine(
        `Syncing checkout with these Sparo profiles:\n${allProfiles.join(', ')}`
      );
    } else if (allProfiles.length === 1) {
      this._terminalService.terminal.writeLine(`Syncing checkout with the Sparo profile: ${allProfiles[0]}`);
    } else {
      this._terminalService.terminal.writeLine(
        'Syncing checkout with the Sparo skeleton (no profile selection)'
      );
    }
    this._terminalService.terminal.writeLine();
    if (!profiles || profiles.size === 0) {
      // If no profile was specified, purge local state to skeleton
      await this._gitSparseCheckoutService.purgeAsync();
    } else {
      const allProfilesIncludeFolders: string[] = [],
        allProfilesExcludeFolders: string[] = [],
        allProfilesSelections: ISelection[] = [];
      for (const profile of profiles) {
        // Since we have run localState.reset() before, for each profile we just add it to local state.
        const { selections, includeFolders, excludeFolders } = await this.resolveSparoProfileAsync(profile, {
          localStateUpdateAction: 'add'
        });
        // combine all profiles' selections and include/exclude folder
        allProfilesSelections.push(...selections);
        allProfilesIncludeFolders.push(...includeFolders);
        allProfilesExcludeFolders.push(...excludeFolders);
      }
      // sparse-checkout set once for all profiles together
      await this._gitSparseCheckoutService.checkoutAsync({
        selections: allProfilesSelections,
        includeFolders: allProfilesIncludeFolders,
        excludeFolders: allProfilesExcludeFolders,
        checkoutAction: 'set'
      });
    }
    if (addProfiles?.size) {
      // If add profiles is specified, using `git sparse-checkout add` to add folders in add profiles
      const allAddProfilesSelections: ISelection[] = [],
        allAddProfilesIncludeFolders: string[] = [],
        allAddProfilesExcludeFolders: string[] = [];
      for (const profile of addProfiles) {
        // For each add profile we add it to local state.
        const { selections, includeFolders, excludeFolders } = await this.resolveSparoProfileAsync(profile, {
          localStateUpdateAction: 'add'
        });
        // combine all add profiles' selections and include/exclude folder
        allAddProfilesSelections.push(...selections);
        allAddProfilesIncludeFolders.push(...includeFolders);
        allAddProfilesExcludeFolders.push(...excludeFolders);
      }
      /**
       * Note:
       * Although we could run sparse-checkout add multiple times,
       * we combine all add operations and execute once for better performance.
       */
      await this._gitSparseCheckoutService.checkoutAsync({
        selections: allAddProfilesSelections,
        includeFolders: allAddProfilesIncludeFolders,
        excludeFolders: allAddProfilesExcludeFolders,
        checkoutAction: 'add'
      });
    }

    // handle case of `sparo checkout --to project-A project-B --from project-C project-D
    const toSelector: Set<string> = toProjects || new Set();
    const fromSelector: Set<string> = fromProjects || new Set();
    // If Rush Selector --to <projects> is specified, using `git sparse-checkout add` to add folders of the projects specified
    const projectsSelections: ISelection[] = [...rushSelectorState];

    for (const project of toSelector) {
      projectsSelections.push({
        selector: '--to',
        argument: project
      });
    }
    for (const project of fromSelector) {
      projectsSelections.push({
        selector: '--from',
        argument: project
      });
    }

    if (projectsSelections.length > 0) {
      await this._syncRushSelectors(projectsSelections);
      await this._gitSparseCheckoutService.checkoutAsync({
        selections: projectsSelections,
        checkoutAction: 'add'
      });
    }
  }
}
