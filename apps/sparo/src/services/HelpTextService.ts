import { inject } from 'inversify';
import { Service } from '../decorator';
import { LogService } from './LogService';

export interface IHelpTextParams {
  logService: LogService;
}
@Service()
export class HelpTextService {
  @inject(LogService) private _logService!: LogService;

  public helpTextMap: Map<string, string> = new Map<string, string>();

  public set(name: string, text: string): void {
    this._logService.logger.silly(`set help text "%s" to "%s"`, name, text);
    this.helpTextMap.set(name, text);
  }
}
