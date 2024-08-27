const { spawnSync } = require('child_process');

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      // Suppress the "Browserslist: caniuse-lite is outdated" warning. Although the warning is
      // potentially useful, the check is performed in a way that is nondeterministic and can cause
      // Rush pipelines to fail. Moreover, the outdated version is often irrelevant and/or nontrivial
      // to upgrade. See this thread for details: https://github.com/microsoft/rushstack/issues/2981
      BROWSERSLIST_IGNORE_OLD_DATA: '1'
    }
  });
  if (result.error) {
    console.log(result.error.message);
    process.exitCode = 1;
    return false;
  }
  process.exitCode = result.status;
  return result.status ? false : true;
}

const docusaurusPath = __dirname + '/node_modules/.bin/docusaurus';

console.log('docusaurus clear');
runCommand(docusaurusPath, ['clear']);

console.log('docusaurus build');
runCommand(docusaurusPath, ['build']);

console.log('done.');
