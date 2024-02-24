const { spawnSync } = require('child_process');

function runCommand(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
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
