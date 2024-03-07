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
  const testRepoURL: string = 'git@github.com:Azure/azure-sdk-for-js.git';
  const repoFolder: string = path.resolve(temporaryDirectory, 'azure-sdk-for-js');

  await FileSystem.deleteFolderAsync(repoFolder);

  const commandDefinitions: ICommandDefinition[] = [
    // sparo clone git@github.com:Azure/azure-sdk-for-js.git
    {
      kind: 'sparo-command',
      name: 'clone',
      args: ['clone', testRepoURL],
      currentWorkingDirectory: temporaryDirectory
    },
    // sparo init-profile --profile my-team
    {
      kind: 'sparo-command',
      name: 'init-profile',
      args: ['init-profile', '--profile', 'my-team'],
      currentWorkingDirectory: repoFolder
    },
    // sparo checkout --profile my-team - extra step to checkout an empty profile
    {
      kind: 'sparo-command',
      name: 'checkout-empty-profile',
      args: ['checkout', '--profile', 'my-team'],
      currentWorkingDirectory: repoFolder
    },
    // Prepare my-team profile
    {
      kind: 'custom-callback',
      name: 'prepare-my-team-profile',
      callback: async () => {
        await FileSystem.writeFileAsync(
          path.resolve(repoFolder, 'common/sparo-profiles/my-team.json'),
          JSON.stringify(
            {
              $schema: 'https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json',
              selections: [
                {
                  selector: '--to',
                  argument: '@azure/arm-commerce'
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
    // sparo checkout --profile my-team
    {
      kind: 'sparo-command',
      name: 'checkout-profile',
      args: ['checkout', '--profile', 'my-team'],
      currentWorkingDirectory: repoFolder
    },
    // sparo list-profiles
    {
      kind: 'sparo-command',
      name: 'list-profiles',
      args: ['list-profiles'],
      currentWorkingDirectory: repoFolder
    },
    // sparo list-profiles --project @azure/core-auth
    {
      kind: 'sparo-command',
      name: 'list-profiles-with-project',
      args: ['list-profiles', '--project', '@azure/core-auth'],
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

  // Clean up the temporary directory in CI builds, but leave it for local debugging
  if (production) {
    await FileSystem.deleteFolderAsync(repoFolder);
  }
}
