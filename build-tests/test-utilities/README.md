# build-test-utilities

The project contains several utility function for build tests.

# Test sparo output with Heft run-script plugin

```ts
import {
  ICommandDefinition,
  executeCommandsAndCollectOutputs,
  updateOrCompareOutputs
} from 'build-test-utilities';
import type { IRunScriptOptions } from '@rushstack/heft';

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
      name: 'clone-help',
      args: ['clone', '--help']
    }
  ];

  await executeCommandsAndCollectOutputs({
    commandDefinitions,
    buildFolderPath,
  })

  await updateOrCompareOutput({
    buildFolderPath,
    logger,
    production,
  }) 
}
```

`executeCommandsAndCollectOutputs` runs the list of specified command definitions, it collects sparo command outputs and save them to `<buildFolderPath>/temp/etc`.

`updateOrCompareOutput` copies the output text files from `<buildFolderPath>/temp/etc` to `<buildFolderPath>/etc`, this ensures the output text files are always up to date, and it must get reviewed in the PR. In CI builds, this function will compares the content between these two folders, and throw a error for unmatched content.