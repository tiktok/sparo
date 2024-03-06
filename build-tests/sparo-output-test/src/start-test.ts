import * as path from 'path';
import { Async, Executable, FileSystem, type FolderItem, Text } from '@rushstack/node-core-library';
import { diff } from 'jest-diff';
import type { SpawnSyncReturns } from 'child_process';
import type { IRunScriptOptions } from '@rushstack/heft';

interface IScenarioDefinition {
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
}

/**
 * This build test is highly inspired by the build test for api-extractor in rushstack.
 */
export async function runAsync(runScriptOptions: IRunScriptOptions): Promise<void> {
  const {
    heftTaskSession: {
      logger,
      parameters: { production }
    },
    heftConfiguration: { buildFolderPath }
  } = runScriptOptions;
  const binPath: string = path.join(buildFolderPath, 'node_modules', '.bin', 'sparo');
  const tempFolder: string = path.join(buildFolderPath, 'temp', 'etc');

  const scenarios: IScenarioDefinition[] = [
    {
      name: 'top-level-help',
      args: ['--help']
    },
    {
      name: 'clone-help',
      args: ['clone', '--help']
    },
    {
      name: 'checkout-help',
      args: ['checkout', '--help']
    },
    {
      name: 'top-level-nonexistent-command',
      args: ['nonexistent-command']
    }
    // FIXME: This is currently broken -- it simply ignores the unrecognized parameter
    // {
    //   name: 'checkout-nonexistent-parameter',
    //   args: ['checkout', '--nonexistent-parameter']
    // }
  ];

  /**
   * Run each scenario and generate outputs
   */
  await FileSystem.ensureEmptyFolderAsync(tempFolder);
  for (const scenario of scenarios) {
    const { name, args } = scenario;
    const result: SpawnSyncReturns<string> = Executable.spawnSync(binPath, args, {
      environment: {
        ...process.env
        // Always use color for the output
        // FORCE_COLOR: 'true'
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
      `Running "sparo ${args.join(' ')}":\n${processVersionString(result.stdout)}`
    );
  }

  /**
   * Files under outFolderPath are tracked by Git, files under inFolderPath are temporary files. During a local build,
   * --production is false, temporary files are copied to outFolderPath. During a CI build, --production is true, the
   * files with same name under these two folders are compared and CI build fails if they are different.
   *
   * This ensures that the temporary files must be up to date in the PR, and people who review the PR must approve any
   * changes.
   */
  const inFolderPath: string = tempFolder;
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

/**
 * Replace all x.y.z version strings with __VERSION__.
 */
function processVersionString(text: string): string {
  return text.replace(/\d+\.\d+\.\d+/g, '__VERSION__');
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
