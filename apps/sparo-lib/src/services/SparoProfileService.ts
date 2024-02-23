import { FileSystem, Async } from '@rushstack/node-core-library';
import path from 'path';
import { inject } from 'inversify';
import { Service } from '../decorator';
import { SparoProfile } from '../logic/SparoProfile';
import { TerminalService } from './TerminalService';
import { GitService } from './GitService';

export interface ISparoProfileServiceParams {
  terminalService: TerminalService;
  sparoProfileFolder: string;
}
const defaultSparoProfileFolder: string = 'common/sparo-profiles';

@Service()
export class SparoProfileService {
  public _profiles: Map<string, SparoProfile> = new Map<string, SparoProfile>();
  private _loadPromise: Promise<void> | undefined;

  @inject(GitService) private _gitService!: GitService;
  @inject(TerminalService) private _terminalService!: TerminalService;

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
          let sparoProfile: SparoProfile | undefined;
          try {
            sparoProfile = await SparoProfile.loadFromFileAsync(this._terminalService, sparoProfilePath);
          } catch (e) {
            // TODO: more error handling
            this._terminalService.terminal.writeErrorLine((e as Error).message);
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

  public getProfileFilepathByName(profileName: string): string {
    return path.resolve(this._sparoProfileFolder, `${profileName}.json`);
  }

  private static _getProfileName(profilePath: string): string {
    const pathArr: string[] = profilePath.split('/');
    const last: string = pathArr[pathArr.length - 1];
    if (last.endsWith('.json')) {
      return last.slice(0, -5);
    }
    return last;
  }
}
