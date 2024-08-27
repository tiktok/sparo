import * as path from 'path';
import { inject } from 'inversify';
import { FileSystem, FolderItem } from '@rushstack/node-core-library';
import { Service } from '../decorator';
import yargs, { type MiddlewareFunction, type Argv, type AsyncCompletionFunction } from 'yargs';
import { TerminalService } from './TerminalService';
import { CommandService, type ICommandInfo } from './CommandService';
import { getFromContainer } from '../di/container';

@Service()
export class ArgvService {
  private _parsed!: {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
  };

  @inject(TerminalService) private _terminalService!: TerminalService;

  public yargsArgv!: Argv;
  public constructor() {
    this.yargsArgv = yargs.scriptName('sparo');
  }

  public async parseArgvAsync(): Promise<void> {
    /**
     * Do not add short name alias here, it confuses weird issue.
     * For example, alias -h to --help
     * Running `sparo commit -m"ath"` will be explained as `sparo commit -m -a -t -h`,
     * which prints help text instead of proxy args to git commit.
     */
    this._parsed = await this.yargsArgv
      .parserConfiguration({
        'populate--': true
      })
      // --debug
      .boolean('debug')
      // --verbose
      .boolean('verbose')
      .middleware([this._terminalMiddleware])
      .completion('completion', false, this._completionFunction)
      .parseAsync();
  }

  public getUserCommand(): string {
    return String(this._parsed._[0] || '');
  }

  public stripSparoArgs(args: string[]): string[] {
    const newArgs: string[] = [];
    for (const arg of args) {
      if (['--debug', '--verbose'].includes(arg)) {
        continue;
      }
      newArgs.push(arg);
    }
    return newArgs;
  }

  private _terminalMiddleware: MiddlewareFunction<{
    debug: boolean | undefined;
    verbose: boolean | undefined;
  }> = ({ debug, verbose }) => {
    if (debug) {
      this._terminalService.setIsDebug(debug);
    }
    if (verbose) {
      this._terminalService.setIsVerbose(verbose);
    }
  };

  /**
   * To test completion, run
   *
   * sparo --get-yargs-completions sparo <command> ...
   */
  private _completionFunction: AsyncCompletionFunction = async (current, argv, done): Promise<void> => {
    const nativeGitCommands: ICommandInfo[] = [
      {
        name: 'add',
        description: 'add file contents to the index'
      },
      { name: 'branch', description: 'list, create, or delete branches' },
      { name: 'checkout', description: 'checkout a branch or paths to the working tree' },
      { name: 'clone', description: 'clone a repository into a new directory' },
      { name: 'commit', description: 'record changes to the repository' },
      { name: 'diff', description: 'show changes between commits, commit and working tree, etc' },
      { name: 'fetch', description: 'download objects and refs from another repository' },
      { name: 'log', description: 'show commit logs' },
      { name: 'merge', description: 'join two or more development histories together' },
      { name: 'pull', description: 'fetch from and merge with another repository or a local branch' },
      { name: 'push', description: 'update remote refs along with associated objects' },
      { name: 'rebase', description: 'forward-port local commits to the updated upstream head' },
      { name: 'reset', description: 'reset current HEAD to the specified state' },
      { name: 'restore', description: 'restore working tree files' },
      { name: 'status', description: 'show the working tree status' }
    ];

    const commandService: CommandService = getFromContainer(CommandService);
    const { commandInfos: sparoCommandInfos } = commandService;
    const finalCommands: ICommandInfo[] = Array.from(sparoCommandInfos.values());
    for (const nativeGitCommand of nativeGitCommands) {
      if (sparoCommandInfos.has(nativeGitCommand.name)) {
        continue;
      }
      finalCommands.push(nativeGitCommand);
    }
    const finalCommandNameSet: Set<string> = new Set<string>(finalCommands.map((x) => x.name));
    const userInputCmdName: string = argv._[1] || '';

    if (finalCommandNameSet.has(userInputCmdName)) {
      switch (current) {
        case 'add': {
          done(this._getFileCompletions());
          break;
        }
        case 'commit':
        case 'branch':
        case 'diff':
        case 'log':
        case 'merge':
        case 'rebase':
        case 'restore':
        case 'status': {
          // TODO: completion for the following commands seem of less use, implement on demand
          done([]);
          break;
        }
        default: {
          break;
        }
      }
      switch (userInputCmdName) {
        case 'add': {
          done(this._getFileCompletions(current));
          break;
        }
        case 'rebase': {
          const shortParameters: string[] = [argv.i || argv.interactive ? '' : '-i'].filter(Boolean);
          const longParameters: string[] = [
            argv.continue ? '' : '--continue',
            argv.skip ? '' : '--skip',
            argv.abort ? '' : '--abort',
            argv.i || argv.interactive ? '' : '--interactive'
          ].filter(Boolean);
          if (current === '-') {
            done(shortParameters);
          } else if (current === '--') {
            done(longParameters);
          } else if (current.startsWith('--')) {
            done(longParameters.filter((parameter) => parameter.startsWith(current)));
          }
          break;
        }
        default: {
          break;
        }
      }
    } else {
      const prefix: string = current === 'sparo' ? '' : current;
      done(
        finalCommands
          .filter(({ name }) => name.startsWith(prefix))
          .map(({ name, description }) => `${name}:${description}`)
      );
    }
  };

  private _getFileCompletions(partial: string = ''): string[] {
    const dir: string = partial.endsWith('/') ? partial : path.dirname(partial);
    const base: string = partial.endsWith('/') ? '' : path.basename(partial);
    try {
      const items: FolderItem[] = FileSystem.readFolderItems(dir);
      return items
        .filter((item) => item.name.startsWith(base))
        .map((item) => {
          if (item.isDirectory()) {
            return path.join(dir, item.name, '/');
          }
          return path.join(dir, item.name);
        });
    } catch (e) {
      // Return empty result if encounter issues
      return [];
    }
  }
}
