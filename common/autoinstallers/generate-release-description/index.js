const yargs = require('yargs');
const { generate } = require('./generate');

const args = yargs(process.argv.slice(2))
  .version(false)
  .option('project', {
    demandOption: true,
    describe: 'A rush project name',
    type: 'string'
  })
  .option('version', {
    demandOption: true,
    describe: "Version number",
    type: 'string'
  }).argv;

generate(args);



