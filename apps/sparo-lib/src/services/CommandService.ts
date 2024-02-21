import { inject } from 'inversify';
import type { Argv } from 'yargs';
import type { ICommand } from '../cli/commands/base';
import { HelpTextService } from './HelpTextService';
import { LogService } from './LogService';
import { Service } from '../decorator';
import { ArgvService } from './ArgvService';
import { Stopwatch } from '../logic/Stopwatch';
import { TelemetryService } from './TelemetryService';
import { getCommandName } from '../cli/commands/util';

export interface ICommandServiceParams {
  yargs: Argv<{}>;
  helpTextService: HelpTextService;
  logService: LogService;
}

@Service()
export class CommandService {
  @inject(ArgvService) private _yargs!: ArgvService;
  @inject(HelpTextService) private _helpTextService!: HelpTextService;
  @inject(LogService) private _logService!: LogService;
  @inject(TelemetryService) private _telemetryService!: TelemetryService;

  public register<O extends {}>(command: ICommand<O>): void {
    const { cmd, description, builder, handler, getHelp } = command;
    const { _logService: logService } = this;
    const { logger } = logService;
    const commandName: string = getCommandName(cmd);
    this._yargs.yargsArgv.command<O>(
      cmd,
      description,
      (yargs: Argv<{}>) => {
        yargs.version(false);
        builder(yargs as unknown as Argv<O>);
      },
      async (args) => {
        process.exitCode = 1;
        try {
          logger.silly(`invoke command "%s" with args %o`, commandName, args);
          const stopwatch: Stopwatch = Stopwatch.start();
          await handler(args, logService);
          logger.silly(`invoke command "%s" done (%s)`, commandName, stopwatch.toString());
          stopwatch.stop();
          this._telemetryService.collectTelemetry({
            commandName,
            args: process.argv.slice(2),
            durationInSeconds: stopwatch.duration,
            startTimestampMs: stopwatch.startTime,
            endTimestampMs: stopwatch.endTime
          });
          // eslint-disable-next-line require-atomic-updates
          process.exitCode = 0;
        } catch (e) {
          // @todo: `e` from git service is undefined sometime
          // to reproduce try call `auto-config` command
          if (typeof e !== 'undefined') logger.error((e as Error).message);
        }
      }
    );
    this._helpTextService.set(commandName, getHelp());
  }
}
