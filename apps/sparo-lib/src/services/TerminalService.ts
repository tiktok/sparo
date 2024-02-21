import { Service } from '../decorator';
import { ConsoleTerminalProvider, Terminal, type ITerminal } from '@rushstack/terminal';

/**
 * Help class for terminal UI
 *
 * @alpha
 */
@Service()
export class TerminalService {
  private _terminal: ITerminal;
  private _terminalProvider: ConsoleTerminalProvider;
  public constructor() {
    this._terminalProvider = new ConsoleTerminalProvider();
    this._terminal = new Terminal(this._terminalProvider);
  }

  public setIsVerbose(value: boolean): void {
    this._terminalProvider.verboseEnabled = value;
    // verbose implies debug
    this._terminalProvider.debugEnabled = value;
  }

  public setIsDebug(value: boolean): void {
    this._terminalProvider.debugEnabled = value;
  }

  public get terminal(): ITerminal {
    return this._terminal;
  }
}

export type { ITerminal };
