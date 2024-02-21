import * as path from 'path';
import * as child_process from 'child_process';
import { inject } from 'inversify';
import { FileSystem } from '@rushstack/node-core-library';
import { Service } from '../decorator';
import { GitService } from './GitService';
import { LogService } from './LogService';

export interface ICloneOptions {
  repository: string;
  directory: string;
}

@Service()
export class GitCloneService {
  @inject(GitService) private _gitService!: GitService;
  @inject(LogService) private _logService!: LogService;

  public resolveCloneDirectory(args: { repository: string; directory?: string }): string {
    const { logger } = this._logService;
    const { repository } = args;
    let { directory } = args;

    // directory
    if (!directory) {
      directory = this._gitService.getBasenameFromUrl(repository);
      logger.debug(`got basename %s from %s`, directory, repository);
    }

    this._checkCloneDestination(directory);

    return directory;
  }

  private _checkCloneDestination(directory: string): void {
    const { logger } = this._logService;

    // absolute path
    let dest: string = directory;
    if (!path.isAbsolute(dest)) {
      dest = path.resolve(process.cwd(), directory);
    }
    logger.debug(`repo destination is %s`, dest);

    const destExists: boolean = FileSystem.exists(dest);
    if (destExists) {
      if (FileSystem.readFolderItemNames(dest).length !== 0) {
        throw new Error(`destination path ${dest} already exists and is not 
an empty directory.`);
      }
    }
  }

  public fullClone({ repository, directory }: ICloneOptions): void {
    const { logger } = this._logService;
    logger.debug('full clone start...');
    const cloneArgs: string[] = ['clone', repository, directory];
    const result: child_process.SpawnSyncReturns<string> = this._gitService.executeGitCommand({
      args: cloneArgs
    });
    if (result?.status) {
      throw new Error(`git clone failed with exit code ${result.status}`);
    }
    logger.debug('full clone done');
  }

  public bloblessClone({ repository, directory }: ICloneOptions): void {
    const { logger } = this._logService;

    logger.debug('blobless clone start...');
    const cloneArgs: string[] = [
      'clone',
      '--filter=blob:none',
      '--sparse',
      '--single-branch',
      repository,
      directory
    ];
    const result: child_process.SpawnSyncReturns<string> = this._gitService.executeGitCommand({
      args: cloneArgs
    });
    if (result?.status) {
      throw new Error(`git clone failed with exit code ${result.status}`);
    }
    logger.debug('blobless clone done');
  }

  public treelessClone({ repository, directory }: ICloneOptions): void {
    const { logger } = this._logService;

    logger.debug('treeless clone start...');
    const cloneArgs: string[] = [
      'clone',
      '--filter=tree:0',
      '--sparse',
      '--single-branch',
      repository,
      directory
    ];
    const result: child_process.SpawnSyncReturns<string> = this._gitService.executeGitCommand({
      args: cloneArgs
    });
    if (result?.status) {
      throw new Error(`git clone failed with exit code ${result.status}`);
    }
    logger.debug('treeless clone done');
  }
}
