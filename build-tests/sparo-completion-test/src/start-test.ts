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

  const prefixArgs: string[] = ['--get-yargs-completions', 'sparo'];

  const commandDefinitions: ICommandDefinition[] = [
    {
      kind: 'sparo-command',
      name: 'sparo-top-level-completion',
      args: prefixArgs.concat([])
    },
    // auto-config
    {
      kind: 'sparo-command',
      name: 'auto-config-completion',
      args: prefixArgs.concat(['auto-config'])
    },
    {
      kind: 'sparo-command',
      name: 'auto-config-long-parameters-completion',
      args: prefixArgs.concat(['auto-config', '--'])
    },
    // list-profiles
    {
      kind: 'sparo-command',
      name: 'list-profiles-completion',
      args: prefixArgs.concat(['list-profiles'])
    },
    {
      kind: 'sparo-command',
      name: 'list-profiles-long-parameters-completion',
      args: prefixArgs.concat(['list-profiles', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'list-profiles-pro-completion',
      args: prefixArgs.concat(['list-profiles', '--pro'])
    },
    {
      kind: 'sparo-command',
      name: 'list-profiles-project-web-completion',
      args: prefixArgs.concat(['list-profiles', '--project', 'web'])
    },
    // init-profile
    {
      kind: 'sparo-command',
      name: 'init-profile-completion',
      args: prefixArgs.concat(['init-profile'])
    },
    {
      kind: 'sparo-command',
      name: 'init-profile-long-parameters-completion',
      args: prefixArgs.concat(['init-profile', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'init-profile-pro-completion',
      args: prefixArgs.concat(['init-profile', '--pro'])
    },
    // clone
    {
      kind: 'sparo-command',
      name: 'clone-completion',
      args: prefixArgs.concat(['clone'])
    },
    {
      kind: 'sparo-command',
      name: 'clone-long-parameters-completion',
      args: prefixArgs.concat(['clone', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'clone-long-parameters-completion',
      args: prefixArgs.concat(['clone', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'clone-pro-completion',
      args: prefixArgs.concat(['clone', '--pro'])
    },
    {
      kind: 'sparo-command',
      name: 'clone-profile-completion',
      args: prefixArgs.concat(['clone', '--profile'])
    },
    // checkout
    {
      kind: 'sparo-command',
      name: 'checkout-completion',
      args: prefixArgs.concat(['checkout'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-long-parameters-completion',
      args: prefixArgs.concat(['checkout', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-pro-completion',
      args: prefixArgs.concat(['checkout', '--pro'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-profile-completion',
      args: prefixArgs.concat(['checkout', '--profile'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-profile-spa-completion',
      args: prefixArgs.concat(['checkout', '--profile', 'spa'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-second-profile-completion',
      args: prefixArgs.concat(['checkout', '--profile', 'sparo-website', '--profile'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-add-profile-completion',
      args: prefixArgs.concat(['checkout', '--add-profile'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-add-profile-spa-completion',
      args: prefixArgs.concat(['checkout', '--add-profile', 'spa'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-second-add-profile-completion',
      args: prefixArgs.concat(['checkout', '--add-profile', 'sparo-website', '--add-profile'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-no-profile-completion',
      args: prefixArgs.concat(['checkout', '--no-profile', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-to-web-completion',
      args: prefixArgs.concat(['checkout', '--to', 'web'])
    },
    {
      kind: 'sparo-command',
      name: 'checkout-from-web-completion',
      args: prefixArgs.concat(['checkout', '--from', 'web'])
    },
    // fetch
    {
      kind: 'sparo-command',
      name: 'fetch-completion',
      args: prefixArgs.concat(['fetch'])
    },
    {
      kind: 'sparo-command',
      name: 'fetch-long-parameters-completion',
      args: prefixArgs.concat(['fetch', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'fetch-long-parameters-with-all-completion',
      args: prefixArgs.concat(['fetch', '--all', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'fetch-long-parameters-with-tags-completion',
      args: prefixArgs.concat(['fetch', '--tags', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'fetch-al-completion',
      args: prefixArgs.concat(['fetch', '--al'])
    },
    {
      kind: 'sparo-command',
      name: 'fetch-origin-HEA-completion',
      args: prefixArgs.concat(['fetch', 'origin', 'HEA'])
    },
    // pull
    {
      kind: 'sparo-command',
      name: 'pull-completion',
      args: prefixArgs.concat(['pull'])
    },
    {
      kind: 'sparo-command',
      name: 'pull-long-parameters-completion',
      args: prefixArgs.concat(['pull', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'pull-pro-completion',
      args: prefixArgs.concat(['pull', '--pro'])
    },
    {
      kind: 'sparo-command',
      name: 'pull-profile-completion',
      args: prefixArgs.concat(['pull', '--profile'])
    },
    {
      kind: 'sparo-command',
      name: 'pull-profile-spa-completion',
      args: prefixArgs.concat(['pull', '--profile', 'spa'])
    },
    {
      kind: 'sparo-command',
      name: 'pull-second-profile-completion',
      args: prefixArgs.concat(['pull', '--profile', 'sparo-website', '--profile'])
    },
    {
      kind: 'sparo-command',
      name: 'pull-no-profile-completion',
      args: prefixArgs.concat(['pull', '--no-profile', '--'])
    },
    // add
    {
      kind: 'sparo-command',
      name: 'add-partial-completion',
      args: prefixArgs.concat(['add', '__fixture__']),
      processStdout: replaceBackslashes
    },
    {
      kind: 'sparo-command',
      name: 'add-folder-completion',
      args: prefixArgs.concat(['add', '__fixture__/']),
      processStdout: replaceBackslashes
    },
    {
      kind: 'sparo-command',
      name: 'add-folder-partial-completion',
      args: prefixArgs.concat(['add', '__fixture__/dir-a/file']),
      processStdout: replaceBackslashes
    },
    // branch
    // commit
    // diff
    // log
    // merge
    // rebase
    {
      kind: 'sparo-command',
      name: 'rebase-short-parameters-completion',
      args: prefixArgs.concat(['rebase', '-'])
    },
    {
      kind: 'sparo-command',
      name: 'rebase-short-with-i-completion',
      args: prefixArgs.concat(['rebase', '-i', '-'])
    },
    {
      kind: 'sparo-command',
      name: 'rebase-short-with-interactive-completion',
      args: prefixArgs.concat(['rebase', '--interactive', '-'])
    },
    {
      kind: 'sparo-command',
      name: 'rebase-long-parameters-completion',
      args: prefixArgs.concat(['rebase', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'rebase-long-with-continue-completion',
      args: prefixArgs.concat(['rebase', '--continue', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'rebase-long-with-skip-completion',
      args: prefixArgs.concat(['rebase', '--skip', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'rebase-long-with-abort-completion',
      args: prefixArgs.concat(['rebase', '--abort', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'rebase-long-with-interactive-completion',
      args: prefixArgs.concat(['rebase', '--interactive', '--'])
    },
    {
      kind: 'sparo-command',
      name: 'rebase-long-with-i-completion',
      args: prefixArgs.concat(['rebase', '-i', '--'])
    }
    // restore
    // status
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

function replaceBackslashes(text: string): string {
  return text.replace(/\\/g, '/');
}
