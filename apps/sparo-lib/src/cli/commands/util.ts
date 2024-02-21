/**
 * The string of cmd here can be "clone <repository> [directory]", this function extracts
 *  the command name from the string.
 */
export function getCommandName(cmd: string): string {
  const commandName: string = cmd.split(' ')[0];
  return commandName;
}
