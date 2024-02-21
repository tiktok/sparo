/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructable<T = any> = abstract new (...args: any[]) => T;

export interface IAppClassInterface {
  /**
   * Sometimes, the class may have some asynchronous operations to be done before ready.
   * `asyncInit` will be called upon prepare the class instance, and the returned
   * `promise` will be waited.
   */
  asyncInit?: () => Promise<unknown>;
}
