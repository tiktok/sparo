import * as path from 'path';
import { FileSystem } from '@rushstack/node-core-library';
import type { IRunScriptOptions } from '@rushstack/heft';
import {
  ICommandDefinition,
  executeCommandsAndCollectOutputs,
  updateOrCompareOutputs
} from 'build-test-utilities';

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

  const temporaryDirectory: string = path.resolve(buildFolderPath, 'temp');
  logger.terminal.writeLine(`Temporary directory: ${temporaryDirectory}`);
  const testRepoURL: string = 'https://github.com/tiktok/sparo.git';
  const testBranch: string = 'test-artifacts/sparo-real-repo-test';
  const repoFolder: string = path.resolve(temporaryDirectory, 'sparo');

  await FileSystem.deleteFolderAsync(repoFolder);

  const commandDefinitions: ICommandDefinition[] = [
    // sparo clone git@github.com:tiktok/sparo.git --branch test-artifacts/sparo-real-repo-test
    {
      kind: 'sparo-command',
      name: 'clone',
      args: ['clone', testRepoURL, '--branch', testBranch],
      currentWorkingDirectory: temporaryDirectory
    },
    // sparo init-profile --profile my-build-test
    {
      kind: 'sparo-command',
      name: 'init-profile',
      args: ['init-profile', '--profile', 'my-build-test'],
      currentWorkingDirectory: repoFolder
    },
    // sparo checkout --profile my-build-test - extra step to checkout an empty profile
    {
      kind: 'sparo-command',
      name: 'checkout-empty-profile',
      args: ['checkout', '--profile', 'my-build-test'],
      currentWorkingDirectory: repoFolder
    },
    // Prepare my-build-test profile
    {
      kind: 'custom-callback',
      name: 'prepare-my-build-test-profile',
      callback: async () => {
        await FileSystem.writeFileAsync(
          path.resolve(repoFolder, 'common/sparo-profiles/my-build-test.json'),
          JSON.stringify(
            {
              $schema: 'https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json',
              selections: [
                {
                  selector: '--to',
                  argument: 'sparo'
                }
              ],
              includeFolders: [],
              excludeFolders: []
            },
            null,
            2
          )
        );
      }
    },
    // sparo checkout --profile my-build-test
    {
      kind: 'sparo-command',
      name: 'checkout-profile',
      args: ['checkout', '--profile', 'my-build-test'],
      currentWorkingDirectory: repoFolder
    },
    // sparo checkout --to sparo-output-test
    {
      kind: 'sparo-command',
      name: 'checkout-to',
      args: ['checkout', '--to', 'sparo-output-test'],
      currentWorkingDirectory: repoFolder
    },
    // sparo checkout --from build-test-utilities
    {
      kind: 'sparo-command',
      name: 'checkout-from',
      args: ['checkout', '--from', 'sparo'],
      currentWorkingDirectory: repoFolder
    },
    // sparo list-profiles
    {
      kind: 'sparo-command',
      name: 'list-profiles',
      args: ['list-profiles'],
      currentWorkingDirectory: repoFolder
    },
    // sparo list-profiles --project sparo-lib
    {
      kind: 'sparo-command',
      name: 'list-profiles-with-project',
      args: ['list-profiles', '--project', 'sparo-lib'],
      currentWorkingDirectory: repoFolder
    }
  ];

  await executeCommandsAndCollectOutputs({
    buildFolderPath,
    commandDefinitions
  });

  await updateOrCompareOutputs({
    buildFolderPath,
    logger,
    production
  });
}
