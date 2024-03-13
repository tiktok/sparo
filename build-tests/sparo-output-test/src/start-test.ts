import {
  ICommandDefinition,
  executeCommandsAndCollectOutputs,
  updateOrCompareOutputs
} from 'build-test-utilities';
import type { IRunScriptOptions } from '@rushstack/heft';

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

  const commandDefinitions: ICommandDefinition[] = [
    {
      kind: 'sparo-command',
      name: 'top-level-help',
      args: ['--help']
    },
    {
      kind: 'sparo-command',
      name: 'clone-help',
      args: ['clone', '--help']
    },
    {
      kind: 'sparo-command',
      name: 'checkout-help',
      args: ['checkout', '--help']
    },
    {
      kind: 'sparo-command',
      name: 'top-level-nonexistent-command',
      args: ['nonexistent-command']
    }
    // FIXME: This is currently broken -- it simply ignores the unrecognized parameter
    // {
    //   kind: 'sparo-command',
    //   name: 'checkout-nonexistent-parameter',
    //   args: ['checkout', '--nonexistent-parameter']
    // }
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
