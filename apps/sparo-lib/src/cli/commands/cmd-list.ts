import { Constructable } from '../../di/types';
import { CloneCommand } from './clone';
import { ListProfilesCommand } from './list-profiles';
import { AutoConfigCommand } from './auto-config';
import { FetchCommand } from './fetch';
import { CICheckoutCommand } from './ci-checkout';
import { CICloneCommand } from './ci-clone';
import { CheckoutCommand } from './checkout';
import { GitCloneCommand } from './git-clone';
import { GitCheckoutCommand } from './git-checkout';
import { GitFetchCommand } from './git-fetch';
import { GitPullCommand } from './git-pull';
import { InitProfileCommand } from './init-profile';
import { PullCommand } from './pull';
import { BranchCommand } from './branch';
import { GitBranchCommand } from './git-branch';

// When adding new Sparo subcommands, remember to update this doc page:
// https://github.com/tiktok/sparo/blob/main/apps/website/docs/pages/commands/overview.md
export const COMMAND_LIST: Constructable[] = [
  AutoConfigCommand,
  ListProfilesCommand,
  InitProfileCommand,

  CloneCommand,
  CheckoutCommand,
  FetchCommand,
  PullCommand,
  BranchCommand,

  // The commands customized by Sparo require a mirror command to Git
  GitCloneCommand,
  GitCheckoutCommand,
  GitFetchCommand,
  GitPullCommand,
  GitBranchCommand
];

export const CI_COMMAND_LIST: Constructable[] = [CICloneCommand, CICheckoutCommand];
