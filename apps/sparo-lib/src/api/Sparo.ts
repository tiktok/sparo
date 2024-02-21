import { SparoCommandLine } from '../cli/SparoCommandLine';
import { SparoCICommandLine } from '../cli/SparoCICommandLine';

/**
 * General operations for Sparo engine.
 *
 * @public
 */
export class Sparo {
  private constructor() {}

  public static async launchSparoAsync(): Promise<void> {
    await SparoCommandLine.launchAsync();
  }

  public static async launchSparoCIAsync(): Promise<void> {
    await SparoCICommandLine.launchAsync();
  }
}
