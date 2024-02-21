import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { LogService } from '../services/LogService';

export interface ICommand<O extends {}> {
  /**
   * cmd should be a string representing the command.
   *
   * @example 'clone <repository> [directory]'
   * @example 'status'
   */
  cmd: string;

  /**
   * description provides a description for the command.
   */
  description: string;

  builder: (yargs: Argv<O>) => void;
  handler: (args: ArgumentsCamelCase<O>, logService: LogService) => Promise<void>;
  getHelp: () => string;
}
