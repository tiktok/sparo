import * as path from 'path';
import { inject } from 'inversify';
import { JsonFile, FileSystem } from '@rushstack/node-core-library';

import type { ISparseProfileJson } from './SparseProfile';
import { Service } from '../decorator';
import { GitService } from '../services/GitService';

export interface ILocalStateProfiles {
  [name: string]: ISparseProfileJson;
}

export interface ILocalStateParams {
  repositoryRoot: string;
}

export type LocalStateUpdateAction = 'add' | 'set';

export interface ILocalStateJson {
  profiles: ILocalStateProfiles;
}

@Service()
export class LocalState {
  private _localStateJson: ILocalStateJson | undefined;
  private _initialized: boolean = false;
  @inject(GitService) private _gitService!: GitService;

  public async loadAsync(): Promise<ILocalStateJson | undefined> {
    if (this._initialized) return;
    try {
      // TODO: validate json schema
      const localStateJson: ILocalStateJson = await JsonFile.loadAsync(this.getStateFilePath());
      this._localStateJson = localStateJson;
      return localStateJson;
    } catch (e) {
      if (!FileSystem.isFileDoesNotExistError(e as Error)) {
        // it is OK to have state file json absent for a newly cloned repo
        // throw e;
      }
    }
    this._initialized = true;
  }

  public async setProfiles(
    profiles: ILocalStateProfiles,
    localStateUpdateAction: LocalStateUpdateAction
  ): Promise<void> {
    await this.loadAsync();

    const getNextProfiles = (): ILocalStateProfiles => {
      switch (localStateUpdateAction) {
        case 'add':
          return {
            ...(this._localStateJson?.profiles || {}),
            ...profiles
          };
        case 'set':
          return profiles;
        default:
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _exhaustiveCheck: never = localStateUpdateAction;
          return profiles;
      }
    };

    const newLocalState: ILocalStateJson = {
      ...this._localStateJson,
      profiles: getNextProfiles()
    };
    this._localStateJson = newLocalState;
    JsonFile.save(newLocalState, this.getStateFilePath(), {
      updateExistingFile: true
    });
  }

  public async getProfiles(): Promise<ILocalStateProfiles | undefined> {
    await this.loadAsync();
    return this._localStateJson?.profiles;
  }

  public reset(): void {
    this._localStateJson = undefined;
    JsonFile.save({}, this.getStateFilePath(), {
      updateExistingFile: true
    });
  }

  public getStateFilePath(): string {
    const repoRoot: string = this._gitService.getRepoInfo().root;
    if (!repoRoot) {
      throw new Error('Running outside of the git repository folder');
    }
    return path.join(this._gitService.getRepoInfo().root, '.git/info/local-state.json');
  }
}
