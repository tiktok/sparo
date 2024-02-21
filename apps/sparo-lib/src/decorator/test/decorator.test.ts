import { getFromContainerAsync } from '../../di/container';
import { AsyncService, ELAPSED } from './__fixture__/service';

describe('@service()', () => {
  it('call async init while resolve the instance', async () => {
    jest.useFakeTimers();
    const p = getFromContainerAsync(AsyncService);
    jest.advanceTimersByTime(ELAPSED);
    const ins = await p;
    expect(ins.constructor.prototype.asyncInit).toBeDefined();
    expect(ins.getName()).toBe('async set name');
  });
});
