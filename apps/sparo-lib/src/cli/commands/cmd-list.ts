import { Constructable } from '../../di/types';
import { CloneCommand } from './clone';
import { HelpCommand } from './help';
import { ListProfilesCommand } from './list-profiles';
import { AutoConfigCommand } from './auto-config';
import { FetchCommand } from './fetch';
import { CIHelpCommand } from './ci-help';
import { CISparseCommand } from './ci-sparse';
import { CICloneCommand } from './ci-clone';
import { CheckoutCommand } from './checkout';
import { GitCloneCommand } from './git-clone';
import { GitCheckoutCommand } from './git-checkout';
import { GitFetchCommand } from './git-fetch';
import { GitPullCommand } from './git-pull';
import { InitProfileCommand } from './init-profile';

// When adding new Sparo subcommands, remember to update this doc page:
// https://github.com/tiktok/sparo/blob/main/apps/website/docs/pages/commands/overview.md
export const COMMAND_LIST: Constructable[] = [
  HelpCommand,
  AutoConfigCommand,
  ListProfilesCommand,
  InitProfileCommand,

  CloneCommand,
  CheckoutCommand,
  FetchCommand,

  // The commands customized by Sparo require a mirror command to Git
  GitCloneCommand,
  GitCheckoutCommand,
  GitFetchCommand,
  GitPullCommand
];

export const CI_COMMAND_LIST: Constructable[] = [CICloneCommand, CISparseCommand, CIHelpCommand];
