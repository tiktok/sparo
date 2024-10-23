const path = require('path');
const { RushConfiguration } = require('@rushstack/rush-sdk');
const { FileSystem } = require('@rushstack/node-core-library');

const rushConfiguration = RushConfiguration.loadFromDefaultLocation();

/** @type (args: { project: string; version: string }) => void */
function generate({project, version}) {

  const rushProject = rushConfiguration.getProjectByName(project);

  if (!rushProject) {
    throw new Error(`Not found project "${project}"`)
  }

  const { projectFolder } = rushProject;

  const changelogJsonFilePath = path.resolve(projectFolder, 'CHANGELOG.json');

  if (!FileSystem.exists(changelogJsonFilePath)) {
    throw new Error(`Not found changelog.json at ${changelogJsonFilePath}`)
  }

  const changelogJsonFileContent = FileSystem.readFile(changelogJsonFilePath, 'utf-8');

  const changelogJson = JSON.parse(changelogJsonFileContent);

  const changeEntry = changelogJson.entries?.find(x => x.version === version);

  if (!changeEntry) {
    throw new Error(`Not found version "${version}" info in ${changelogJsonFilePath}`)
  }

  const comments = Object.entries(changeEntry.comments).map(([_, value]) => {
    return value.map(x => x.comment);
  }).flat();
  console.log('commnets', comments);

  const content = `### Update

${comments.map(x => `- ${x}`).join('\n')}
`

  const releaseFilePath = path.resolve(rushConfiguration.rushJsonFolder, 'RELEASE', `${project.toUpperCase()}.md`)

  FileSystem.writeFile(releaseFilePath, content, {
    ensureFolderExists: true,
  });
}

module.exports = {
  generate
}
