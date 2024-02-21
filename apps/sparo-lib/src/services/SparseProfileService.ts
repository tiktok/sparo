import { FileSystem, Async } from '@rushstack/node-core-library';
import { inject } from 'inversify';
import { Service } from '../decorator';
import { SparseProfile } from '../logic/SparseProfile';
import { LogService } from './LogService';
import { GitService } from './GitService';

export interface ISparseProfileServiceParams {
  logService: LogService;
  sparseProfileFolder: string;
}
const defaultSparseProfileFolder: string = 'common/sparse-profiles';

@Service()
export class SparseProfileService {
  public _profiles: Map<string, SparseProfile> = new Map<string, SparseProfile>();
  private _loadPromise: Promise<void> | undefined;

  @inject(GitService) private _gitService!: GitService;
  @inject(LogService) private _logService!: LogService;

  public async loadProfilesAsync(): Promise<void> {
    if (!this._loadPromise) {
      this._loadPromise = (async () => {
        const sparseProfileFolder: string = defaultSparseProfileFolder;
        const sparseProfilePaths: string[] = await FileSystem.readFolderItemNamesAsync(sparseProfileFolder, {
          absolutePaths: true
        });

        await Async.forEachAsync(sparseProfilePaths, async (sparseProfilePath: string) => {
          let sparseProfile: SparseProfile | undefined;
          try {
            sparseProfile = await SparseProfile.loadFromFileAsync(this._logService, sparseProfilePath);
          } catch (e) {
            // TODO: more error handling
            this._logService.logger.info(e);
          }

          if (sparseProfile) {
            const profileName: string = SparseProfileService._getProfileName(sparseProfilePath);
            this._logService.logger.debug(`load sparse profile %s from %s`, profileName, sparseProfilePath);
            this._profiles.set(profileName, sparseProfile);
          }
        });
      })();
    }
    return this._loadPromise;
  }

  public async getProfileAsync(name: string): Promise<SparseProfile | undefined> {
    await this.loadProfilesAsync();
    return this._profiles.get(name);
  }

  public async getProfilesAsync(): Promise<Map<string, SparseProfile>> {
    await this.loadProfilesAsync();
    return this._profiles;
  }

  public hasProfile(name: string, branch: string): boolean {
    return this._gitService.hasFile(`${defaultSparseProfileFolder}/${name}.json`, branch);
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
