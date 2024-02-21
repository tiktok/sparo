import { Service } from '../decorator';
import yargs, { type Argv } from 'yargs';

@Service()
export class ArgvService {
  private _parsed!: {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
  };

  public yargsArgv!: Argv;
  public constructor() {
    this.yargsArgv = yargs.scriptName('sparo');
  }

  public async parseArgvAsync(): Promise<void> {
    this._parsed = await this.yargsArgv.help(false).parseAsync();
  }

  public getUserCommand(): string {
    return String(this._parsed._[0] || '');
  }
}
