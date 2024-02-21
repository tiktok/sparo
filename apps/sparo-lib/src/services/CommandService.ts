import { inject } from 'inversify';
import type { Argv } from 'yargs';
import type { ICommand } from '../cli/commands/base';
import { HelpTextService } from './HelpTextService';
import { LogService } from './LogService';
import { Service } from '../decorator';
import { ArgvService } from './ArgvService';
import { Stopwatch } from '../logic/Stopwatch';

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

  public register<O extends {}>(command: ICommand<O>): void {
    const { cmd: name, description, builder, handler, getHelp } = command;
    const { _logService: logService } = this;
    const { logger } = logService;
    this._yargs.yargsArgv.command<O>(
      name,
      description,
      (yargs: Argv<{}>) => {
        yargs.version(false);
        builder(yargs as unknown as Argv<O>);
      },
      async (args) => {
        process.exitCode = 1;
        try {
          logger.silly(`invoke command "%s" with args %o`, name, args);
          const stopwatch: Stopwatch = Stopwatch.start();
          await handler(args, logService);
          logger.silly(`invoke command "%s" done (%s)`, name, stopwatch.toString());
          stopwatch.stop();
          // eslint-disable-next-line require-atomic-updates
          process.exitCode = 0;
        } catch (e) {
          // @todo: `e` from git service is undefined sometime
          // to reproduce try call `auto-config` command
          if (typeof e !== 'undefined') logger.error((e as Error).message);
        }
      }
    );
    this._helpTextService.set(name, getHelp());
  }
}
