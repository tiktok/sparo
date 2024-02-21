import { SparoCommandLine } from '../cli/SparoCommandLine';
import { SparoCICommandLine } from '../cli/SparoCICommandLine';
import type { ICollectTelemetryFunction } from '../services/TelemetryService';

/**
 * Options to pass to the sparo "launch" functions.
 *
 * @public
 */
export interface ILaunchOptions {
  /**
   * A callback function to tell Sparo how to handle telemetry
   * @internal
   *
   * @remarks
   * This is a temporary implementation for customizing telemetry reporting.
   * Later, the API will be redesigned to meet more generic requirements.
   */
  collectTelemetryAsync?: ICollectTelemetryFunction;
}

/**
 * General operations for Sparo engine.
 *
 * @public
 */
export class Sparo {
  private constructor() {}

  public static async launchSparoAsync(launchOptions: ILaunchOptions): Promise<void> {
    await SparoCommandLine.launchAsync(launchOptions);
  }

  public static async launchSparoCIAsync(launchOptions: ILaunchOptions): Promise<void> {
    await SparoCICommandLine.launchAsync(launchOptions);
  }
}
