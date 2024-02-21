import { Constructable } from '../di/types';
import { registerClass } from '../di/container';

export function Service(): <T extends Constructable>(target: T) => T {
  return function <T extends Constructable>(target: T) {
    return registerClass(target);
  };
}

export function Command(): <T extends Constructable>(target: T) => T {
  return function <T extends Constructable>(target: T) {
    return registerClass(target);
  };
}
