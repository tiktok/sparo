import { Service } from '../decorator';

type ICallback = () => void;

/**
 * Helper class for managing graceful shutdown callbacks
 *
 * Example:
 * When running "sparo fetch --all", the command will temporarily modify git configs.
 * It's essential to register a restore callback via graceful shutdown service to
 * prevent inconsistent git configs status if user presses CTRL + C to terminate the
 * process in the middle of running.
 */
@Service()
export class GracefulShutdownService {
  private _callbacks: Set<ICallback> = new Set<ICallback>();

  public setup = (): void => {
    process.on('SIGINT', () => this._handleSignal());
  };

  public registerCallback = (cb: ICallback): void => {
    this._callbacks.add(cb);
  };

  public unregisterCallback = (cb?: ICallback): void => {
    if (!cb) {
      return;
    }
    this._callbacks.delete(cb);
  };

  private _handleSignal = (): void => {
    // Keep the implementation simple to run each callbacks synchronously.
    for (const cb of Array.from(this._callbacks)) {
      cb();
      this.unregisterCallback(cb);
    }
  };
}
