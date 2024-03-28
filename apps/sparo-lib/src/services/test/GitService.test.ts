import { getFromContainerAsync } from '../../di/container';
import { GitService } from '../GitService';

describe(GitService.name, () => {
  it(`should work with git ssh url`, async () => {
    const gitService = await getFromContainerAsync(GitService);
    const { getBasenameFromUrl } = gitService;
    expect(getBasenameFromUrl('git@github.com:example/sparo.git')).toBe('sparo');
    expect(getBasenameFromUrl('git@github.com:example/sparo_foo.git')).toBe('sparo_foo');
    expect(getBasenameFromUrl('git@github.com:example/sparo-foo.git')).toBe('sparo-foo');
  });

  it('should work with malicious url', async () => {
    /**
     * This test make sure sparo aligns with git's behavior when handling URL characters.
     */
    const gitService = await getFromContainerAsync(GitService);
    const { getBasenameFromUrl } = gitService;
    // Example: ../sparo
    expect(getBasenameFromUrl('git@github.com:example/%2E%2E%2Fsparo.git')).toBe('%2E%2E%2Fsparo');
    // Example: \.\.\/sparo
    expect(getBasenameFromUrl('git@github.com:example/%252E%252E%252Fsparo.git')).toBe(
      '%252E%252E%252Fsparo'
    );
  });

  it('should get commit object type', async () => {
    const gitService = await getFromContainerAsync(GitService);
    // Shallow clone is used in CI builds, so getting the current commit SHA of HEAD
    const commitSHA: string = gitService
      .executeGitCommandAndCaptureOutput({
        args: ['rev-parse', 'HEAD']
      })
      .trim();
    expect(commitSHA).toBeTruthy();
    const objectType = gitService.getObjectType(commitSHA);
    expect(objectType).toBe('commit');
  });
  it('should get unknown object type', async () => {
    const gitService = await getFromContainerAsync(GitService);
    const objectType = gitService.getObjectType('foo');
    expect(objectType).toBeUndefined();
  });
});
