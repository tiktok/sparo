import { Constructable } from '../../di/types';
import { CloneCommand } from './clone';
import { HelpCommand } from './help';
import { SparseCommand } from './sparse';
import { SparseListCommand } from './sparse-list';
import { SparseAddCommand } from './sparse-add';
import { AutoConfigCommand } from './auto-config';
import { FetchCommand } from './fetch';
import { PurgeCommand } from './purge';
import { CIHelpCommand } from './ci-help';
import { CISparseCommand } from './ci-sparse';
import { CICloneCommand } from './ci-clone';

export const COMMAND_LIST: Constructable[] = [
  CloneCommand,
  SparseCommand,
  HelpCommand,
  SparseListCommand,
  SparseAddCommand,
  AutoConfigCommand,
  FetchCommand,
  PurgeCommand
];

export const CI_COMMAND_LIST: Constructable[] = [CICloneCommand, CISparseCommand, CIHelpCommand];
