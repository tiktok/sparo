import { Service } from '../decorator';

/**
 * @alpha
 */
export interface ITelemetryData {
  /**
   * Command name
   * @example clone
   */
  readonly commandName: string;

  /**
   * Argument list
   */
  readonly args: string[];

  /**
   * Duration in seconds
   */
  readonly durationInSeconds: number;

  /**
   * A timestamp in milliseconds (from `performance.now()`) when the operation started.
   * If the operation was blocked, will be `undefined`.
   */
  readonly startTimestampMs?: number;

  /**
   * A timestamp in milliseconds (from `performance.now()`) when the operation finished.
   * If the operation was blocked, will be `undefined`.
   */
  readonly endTimestampMs?: number;

  /**
   * Indicates raw git command
   */
  readonly isRawGitCommand?: boolean;
}

/**
 * @alpha
 */
export type ICollectTelemetryFunction = (data: ITelemetryData) => Promise<void>;

/**
 * A help class to collect telemetry. The way to collect data is specified during launch Sparo.
 * NOTE: In this release version, we do NOT upload any telemetry data. It's under test internally
 *  and the API will be refactored to meet generic requirements later.
 */
@Service()
export class TelemetryService {
  private _tasks: Set<Promise<void>> = new Set();

  private _collectTelemetryAsyncMaybe: ICollectTelemetryFunction | undefined;

  /**
   * This is a sync function. Collecting telemetry should not block anything.
   * In the end of process, "ensureCollectedAsync" should be called.
   */
  public collectTelemetry(data: ITelemetryData): void {
    if (this._collectTelemetryAsyncMaybe) {
      const task: Promise<void> = this._collectTelemetryAsyncMaybe(data);
      this._tasks.add(task);
      task
        .then(() => {
          this._tasks.delete(task);
        })
        .catch(() => {
          this._tasks.delete(task);
        });
    }
  }

  public async ensureCollectedAsync(): Promise<void> {
    await Promise.all(this._tasks);
  }

  public setCollectTelemetryFunction(fn: ICollectTelemetryFunction): void {
    this._collectTelemetryAsyncMaybe = fn;
  }
}
