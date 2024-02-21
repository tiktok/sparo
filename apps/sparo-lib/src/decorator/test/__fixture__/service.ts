import { Service } from '../..';
import type { IAppClassInterface } from '../../../di/types';

export const ELAPSED: number = 500;
@Service()
export class AsyncService implements IAppClassInterface {
  public name: string = 'init value';

  public async asyncInit(): Promise<string | void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ELAPSED);
    }).then(() => (this.name = 'async set name'));
  }

  public getName(): string {
    return this.name;
  }
}
