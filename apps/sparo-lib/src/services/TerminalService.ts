import { Service } from '../decorator';
import {
  Colorize,
  ConsoleTerminalProvider,
  Terminal,
  type ITerminal,
  PrintUtilities
} from '@rushstack/terminal';

/**
 * Help class for terminal UI
 *
 * @alpha
 */
@Service()
export class TerminalService {
  private _terminal: ITerminal;
  private _terminalProvider: ConsoleTerminalProvider;
  private _asciiHeaderWidth: number;
  public constructor() {
    this._terminalProvider = new ConsoleTerminalProvider();
    this._terminal = new Terminal(this._terminalProvider);
    this._asciiHeaderWidth = (PrintUtilities.getConsoleWidth() ?? 80) - 1;
  }

  public setIsVerbose(value: boolean): void {
    this._terminalProvider.verboseEnabled = value;
  }

  public setIsDebug(value: boolean): void {
    this._terminalProvider.debugEnabled = value;
    // debug implies verbose
    this._terminalProvider.verboseEnabled = value;
  }

  public get terminal(): ITerminal {
    return this._terminal;
  }

  // print a Rush-style divider bar
  public writeTaskHeader(taskTitle: string): void {
    // Format a header like this
    //
    // --[ git clone ]------------------------------------------------

    this._terminal.writeLine();

    // leftPart: "--[ git clone "
    const leftPart: string = Colorize.gray('--[') + ' ' + Colorize.bold(taskTitle) + ' ';
    const leftPartLength: number = 4 + taskTitle.length + 1;

    // restPart: "]-------------"
    const bracketLength: number = 1;
    const restPartLengthMinusBracket: number = Math.max(
      this._asciiHeaderWidth - (leftPartLength + bracketLength),
      0
    );

    const restPart: string = Colorize.gray(']' + '-'.repeat(restPartLengthMinusBracket));

    this._terminal.writeLine(leftPart + restPart);
  }

  public writeTaskFooter(): void {
    this._terminal.writeLine(Colorize.gray('-'.repeat(this._asciiHeaderWidth)));
    this._terminal.writeLine();
  }
}

export type { ITerminal };
