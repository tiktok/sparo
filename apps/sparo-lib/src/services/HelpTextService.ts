import { inject } from 'inversify';
import { Service } from '../decorator';
import { TerminalService } from './TerminalService';

export interface IHelpTextParams {
  terminalService: TerminalService;
}
@Service()
export class HelpTextService {
  @inject(TerminalService) private _terminalService!: TerminalService;

  public helpTextMap: Map<string, string> = new Map<string, string>();

  public set(name: string, text: string): void {
    this._terminalService.terminal.writeVerboseLine(`set help text "${name}" to "${text}"`);
    this.helpTextMap.set(name, text);
  }
}
