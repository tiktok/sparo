import { PackageJsonLookup } from '@rushstack/node-core-library';

/**
 * The currently-executing sparo-lib package's root folder path.
 */
export const sparoLibFolderRootPath: string = PackageJsonLookup.instance.tryGetPackageFolderFor(__dirname)!;

/**
 * The path to the assets folder in rush-lib.
 */
export const assetsFolderPath: string = `${sparoLibFolderRootPath}/assets`;

/**
 * The string of cmd here can be "clone <repository> [directory]", this function extracts
 *  the command name from the string.
 */
export function getCommandName(cmd: string): string {
  const commandName: string = cmd.split(' ')[0];
  return commandName;
}
