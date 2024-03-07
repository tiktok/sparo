import * as path from 'path';
import { Async, Executable, FileSystem, Text, type FolderItem } from '@rushstack/node-core-library';
import { diff } from 'jest-diff';
import type { SpawnSyncReturns } from 'child_process';
import type { IScopedLogger } from '@rushstack/heft';

export type ICommandDefinition = ISparoCommandDefinition | ICustomCallbackDefinition;

export interface ISparoCommandDefinition {
  kind: 'sparo-command';
  /**
   * The scenario name. It is used to generate the output file name.
   *
   * For example, if the name is "top-level-help", the output file name will be "top-level-help.txt".
   */
  name: string;
  /**
   * The command line arguments to run. This doesn't include the command name itself.
   *
   * For example, if the command is "sparo clone --help", the args will be ["clone", "--help"].
   */
  args: string[];

  /**
   * The working directory
   */
  currentWorkingDirectory?: string;
}

export interface ICustomCallbackDefinition {
  kind: 'custom-callback';
  /**
   * Name of the custom definition
   */
  name: string;
  /**
   * Callback function to run logic between commands
   */
  callback: () => Promise<void>;
}

export interface IExecuteCommandsAndCollectOutputsOptions {
  commandDefinitions: ICommandDefinition[];
  buildFolderPath: string;
}

/**
 * Execute a list of predefined commands, collecting the sparo outputs to a temporary folder.
 */
export async function executeCommandsAndCollectOutputs({
  commandDefinitions,
  buildFolderPath
}: IExecuteCommandsAndCollectOutputsOptions): Promise<void> {
  const sparoBinPath: string = path.join(buildFolderPath, 'node_modules', '.bin', 'sparo');
  const tempFolder: string = path.join(buildFolderPath, 'temp', 'etc');

  /**
   * Run each scenario and generate outputs
   */
  await FileSystem.ensureEmptyFolderAsync(tempFolder);
  for (const commandListDefinition of commandDefinitions) {
    const { kind } = commandListDefinition;
    switch (commandListDefinition.kind) {
      case 'sparo-command': {
        const { name, args, currentWorkingDirectory } = commandListDefinition;
        const result: SpawnSyncReturns<string> = Executable.spawnSync(sparoBinPath, args, {
          currentWorkingDirectory,
          environment: {
            ...process.env,
            // Always use color for the output
            FORCE_COLOR: 'true'
          }
        });

        if (result.status !== 0) {
          throw new Error(
            `Failed to run "sparo ${args.join(' ')}" with exit code ${result.status}\n${result.stderr}`
          );
        }

        const outputPath: string = path.join(tempFolder, `${name}.txt`);
        FileSystem.writeFile(
          outputPath,
          `Running "sparo ${args.join(' ')}":\n${processSparoOutput(
            result.stdout,
            currentWorkingDirectory || process.cwd()
          )}`
        );
        break;
      }
      case 'custom-callback': {
        const { name, callback } = commandListDefinition;
        try {
          await callback();
        } catch (e) {
          throw new Error(`Failed to run custom callback function for ${name}:\n${e.message}`);
        }
        break;
      }
      default: {
        throw new Error(`Unrecognized command kind: ${kind}`);
      }
    }
  }
}

export interface IUpdateOrCompareOutputs {
  buildFolderPath: string;
  production: boolean;
  logger: IScopedLogger;
}

/**
 * Based on buildFolderPath, we have a inFolderPath and outFolderPath.
 *
 * Files under outFolderPath are tracked by Git, files under inFolderPath are temporary files. During a local build,
 * --production is false, temporary files are copied to outFolderPath. During a CI build, --production is true, the
 * files with same name under these two folders are compared and CI build fails if they are different.
 *
 * The file structure could be:
 *
 * -- buildFolder
 *  |- temp
 *     |- etc
 *        |- foo.txt
 *  |- etc
 *     |- foo.txt
 *
 * This ensures that the temporary files must be up to date in the PR, and people who review the PR must approve any
 * changes.
 */
export async function updateOrCompareOutputs({
  buildFolderPath,
  production,
  logger
}: IUpdateOrCompareOutputs): Promise<void> {
  const inFolderPath: string = `${buildFolderPath}/temp/etc`;
  const outFolderPath: string = `${buildFolderPath}/etc`;
  await FileSystem.ensureFolderAsync(outFolderPath);

  const inFolderPaths: AsyncIterable<string> = enumerateFolderPaths(inFolderPath, '');
  const outFolderPaths: AsyncIterable<string> = enumerateFolderPaths(outFolderPath, '');
  const outFolderPathsSet: Set<string> = new Set<string>();

  for await (const outFolderPath of outFolderPaths) {
    outFolderPathsSet.add(outFolderPath);
  }

  const nonMatchingFiles: string[] = [];
  const nonMatchingFileErrorMessages: Map<string, string> = new Map<string, string>();
  await Async.forEachAsync(
    inFolderPaths,
    async (folderItemPath: string) => {
      outFolderPathsSet.delete(folderItemPath);

      const sourceFileContents: string = await FileSystem.readFileAsync(inFolderPath + folderItemPath);
      const outFilePath: string = outFolderPath + folderItemPath;

      let outFileContents: string | undefined;
      try {
        outFileContents = await FileSystem.readFileAsync(outFilePath);
      } catch (e) {
        if (!FileSystem.isNotExistError(e)) {
          throw e;
        }
      }

      const normalizedSourceFileContents: string = Text.convertToLf(sourceFileContents);
      const normalizedOutFileContents: string | undefined = outFileContents
        ? Text.convertToLf(outFileContents)
        : undefined;

      if (normalizedSourceFileContents !== normalizedOutFileContents) {
        nonMatchingFiles.push(outFilePath);
        if (production) {
          // Display diff only when running in production mode, mostly for CI build
          nonMatchingFileErrorMessages.set(
            outFilePath,
            diff(normalizedOutFileContents, normalizedSourceFileContents) || ''
          );
        }
        if (!production) {
          await FileSystem.writeFileAsync(outFilePath, normalizedSourceFileContents, {
            ensureFolderExists: true
          });
        }
      }
    },
    {
      concurrency: 10
    }
  );

  if (outFolderPathsSet.size > 0) {
    nonMatchingFiles.push(...outFolderPathsSet);
    if (!production) {
      await Async.forEachAsync(
        outFolderPathsSet,
        async (outFolderPath) => {
          await FileSystem.deleteFileAsync(`${outFolderPath}/${outFolderPath}`);
        },
        { concurrency: 10 }
      );
    }
  }

  if (nonMatchingFiles.length > 0) {
    const errorLines: string[] = [];
    for (const nonMatchingFile of nonMatchingFiles.sort()) {
      errorLines.push(`  ${nonMatchingFile}`);
      const errorMessage: string | undefined = nonMatchingFileErrorMessages.get(nonMatchingFile);
      if (errorMessage) {
        errorLines.push(`${errorMessage}`);
      }
    }

    if (production) {
      logger.emitError(
        new Error(
          'The following file(s) do not match the expected output. Build this project in non-production ' +
            `mode and commit the changes:\n${errorLines.join('\n')}`
        )
      );
    } else {
      logger.emitWarning(
        new Error(
          `The following file(s) do not match the expected output and must be committed to Git:\n` +
            errorLines.join('\n')
        )
      );
    }
  }
}

function processSparoOutput(text: string, workingDirectory: string): string {
  return [
    replaceVersionString,
    replaceDurationString,
    replaceWorkingDirectoryPath,
    replaceFolderCountString
  ].reduce((text, fn) => fn(text, workingDirectory), text);
}
/**
 * Replace all x.y.z version strings with __VERSION__.
 */
function replaceVersionString(text: string): string {
  return text.replace(/\d+\.\d+\.\d+/g, '__VERSION__');
}
/**
 * Replace all "in xx.yy seconds" strings with "in __DURATION__ seconds".
 */
function replaceDurationString(text: string): string {
  return text.replace(/in \d+(\.\d+)? seconds/g, 'in __DURATION__');
}
/**
 * Replace all "<workingDirectory>" strings with "__WORKING_DIRECTORY__".
 */
function replaceWorkingDirectoryPath(text: string, workingDirectory: string): string {
  return text.replace(new RegExp(workingDirectory, 'g'), '__WORKING_DIRECTORY__');
}
/**
 * Replace "Checking out x folders" with "Checking out __FOLDER_COUNT__ folders".
 */
function replaceFolderCountString(text: string): string {
  return text.replace(/Checking out \d+ folders/g, 'Checking out __FOLDER_COUNT__ folders');
}

async function* enumerateFolderPaths(
  absoluteFolderPath: string,
  relativeFolderPath: string
): AsyncIterable<string> {
  const folderItems: FolderItem[] = await FileSystem.readFolderItemsAsync(absoluteFolderPath);
  for (const folderItem of folderItems) {
    const childRelativeFolderPath: string = `${relativeFolderPath}/${folderItem.name}`;
    if (folderItem.isDirectory()) {
      yield* enumerateFolderPaths(`${absoluteFolderPath}/${folderItem.name}`, childRelativeFolderPath);
    } else {
      yield childRelativeFolderPath;
    }
  }
}
