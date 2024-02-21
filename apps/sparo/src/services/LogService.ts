import { Service } from '../decorator';
import winston from 'winston';

const { format } = winston;

export interface ILogServiceParams {
  /**
   * Following RFC5424. See https://datatracker.ietf.org/doc/html/rfc5424
   * error: 0,
   * warn: 1,
   * info: 2,
   * http: 3,
   * verbose: 4,
   * debug: 5,
   * silly: 6
   */
  logLevel: string;
}

export type Logger = winston.Logger;

@Service()
export class LogService {
  private _logger: Logger;
  public constructor() {
    this._logger = winston.createLogger({
      level: 'silly',
      format: format.combine(format.colorize(), format.splat(), format.simple()),
      transports: [
        // TODO: log to files
        new winston.transports.Console({})
      ]
    });
  }

  public get logger(): Logger {
    return this._logger;
  }
}
