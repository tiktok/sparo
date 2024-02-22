import { inject } from 'inversify';
import { Service } from '../decorator';
import yargs, { type MiddlewareFunction, type Argv } from 'yargs';
import { TerminalService } from './TerminalService';

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
    this._parsed = await this.yargsArgv
      .help(false)
      .boolean('debug')
      .boolean('verbose')
      .middleware([this._terminalMiddleware])
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
}
