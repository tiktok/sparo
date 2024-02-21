import { getFromContainer } from '../../di/container';
import { GitService } from '../GitService';

describe(GitService.name, () => {
  it(`should work with git ssh url`, async () => {
    const gitService = await getFromContainer(GitService);
    const { getBasenameFromUrl } = gitService;
    expect(getBasenameFromUrl('git@github.com:example/sparo.git')).toBe('sparo');
    expect(getBasenameFromUrl('git@github.com:example/sparo_foo.git')).toBe('sparo_foo');
    expect(getBasenameFromUrl('git@github.com:example/sparo-foo.git')).toBe('sparo-foo');
  });
});
