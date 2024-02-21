import * as path from 'path';
import * as child_process from 'child_process';
import { inject } from 'inversify';
import { FileSystem } from '@rushstack/node-core-library';
import { Service } from '../decorator';
import { GitService } from './GitService';
import { TerminalService } from './TerminalService';

export interface ICloneOptions {
  repository: string;
  directory: string;
}

@Service()
export class GitCloneService {
  @inject(GitService) private _gitService!: GitService;
  @inject(TerminalService) private _terminalService!: TerminalService;

  public resolveCloneDirectory(args: { repository: string; directory?: string }): string {
    const { terminal } = this._terminalService;
    const { repository } = args;
    let { directory } = args;

    // directory
    if (!directory) {
      directory = this._gitService.getBasenameFromUrl(repository);
      terminal.writeDebugLine(`got basename ${directory} from ${repository}`);
    }

    this._checkCloneDestination(directory);

    return directory;
  }

  private _checkCloneDestination(directory: string): void {
    const { terminal } = this._terminalService;

    // absolute path
    let dest: string = directory;
    if (!path.isAbsolute(dest)) {
      dest = path.resolve(process.cwd(), directory);
    }
    terminal.writeDebugLine(`repo destination is ${dest}`);

    const destExists: boolean = FileSystem.exists(dest);
    if (destExists) {
      if (FileSystem.readFolderItemNames(dest).length !== 0) {
        throw new Error(`destination path ${dest} already exists and is not 
an empty directory.`);
      }
    }
  }

  public fullClone({ repository, directory }: ICloneOptions): void {
    const { terminal } = this._terminalService;
    terminal.writeDebugLine('full clone start...');
    const cloneArgs: string[] = ['clone', repository, directory];
    const result: child_process.SpawnSyncReturns<string> = this._gitService.executeGitCommand({
      args: cloneArgs
    });
    if (result?.status) {
      throw new Error(`git clone failed with exit code ${result.status}`);
    }
    terminal.writeDebugLine('full clone done');
  }

  public bloblessClone({ repository, directory }: ICloneOptions): void {
    const { terminal } = this._terminalService;

    terminal.writeDebugLine('blobless clone start...');
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
    terminal.writeDebugLine('blobless clone done');
  }

  public treelessClone({ repository, directory }: ICloneOptions): void {
    const { terminal } = this._terminalService;

    terminal.writeDebugLine('treeless clone start...');
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
    terminal.writeDebugLine('treeless clone done');
  }
}
