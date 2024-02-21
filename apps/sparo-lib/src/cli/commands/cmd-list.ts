import { Constructable } from '../../di/types';
import { CloneCommand } from './clone';
import { HelpCommand } from './help';
import { ListProfilesCommand } from './list-profiles';
import { AutoConfigCommand } from './auto-config';
import { FetchCommand } from './fetch';
import { PurgeCommand } from './purge';
import { CIHelpCommand } from './ci-help';
import { CISparseCommand } from './ci-sparse';
import { CICloneCommand } from './ci-clone';
import { CheckoutCommand } from './checkout';

export const COMMAND_LIST: Constructable[] = [
  CloneCommand,
  CheckoutCommand,
  HelpCommand,
  ListProfilesCommand,
  AutoConfigCommand,
  FetchCommand,
  PurgeCommand
];

export const CI_COMMAND_LIST: Constructable[] = [CICloneCommand, CISparseCommand, CIHelpCommand];
