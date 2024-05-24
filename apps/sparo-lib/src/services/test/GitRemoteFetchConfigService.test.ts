import { getFromContainer } from '../../di/container';
import { GitRemoteFetchConfigService } from '../GitRemoteFetchConfigService';

describe(GitRemoteFetchConfigService.name, () => {
  const gitRemoteFetchConfigService = getFromContainer(GitRemoteFetchConfigService);

  describe(gitRemoteFetchConfigService.getBranchesInfoFromRemoteFetchConfig, () => {
    it('should work', () => {
      const values: string[] = [
        '+refs/heads/*:refs/remotes/origin/*',
        '+refs/heads/release:refs/remotes/origin/release',
        '+refs/heads/feat/abc:refs/remotes/origin/feat/abc'
      ];

      const expectedContaining: Record<string, string> = {
        '*': values[0],
        release: values[1],
        'feat/abc': values[2]
      };

      for (const [k, v] of Object.entries(
        gitRemoteFetchConfigService.getBranchesInfoFromRemoteFetchConfig(values)
      )) {
        expect(v).toBe(expect.arrayContaining([expectedContaining[k]]));
      }
    });
  });
});
