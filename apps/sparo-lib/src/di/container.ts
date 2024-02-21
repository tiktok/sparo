import 'reflect-metadata';
import { Container, decorate, injectable, METADATA_KEY, postConstruct } from 'inversify';
import { IAppClassInterface, Constructable } from './types';

let ROOT_CONTAINER_INITIALIZED: boolean = false;
let ROOT_CONTAINER: Container;
function setupRootContainer(): Container {
  // we are using `inversify` as our container of class instance
  // https://github.com/inversify/InversifyJS
  if (!ROOT_CONTAINER_INITIALIZED) {
    ROOT_CONTAINER_INITIALIZED = true;
    ROOT_CONTAINER = new Container({
      // https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#autobindinjectable
      autoBindInjectable: true,
      // https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#defaultscope
      defaultScope: 'Singleton'
    });
  }
  return ROOT_CONTAINER;
}

export const APPLICATION_ROOT_CONTAINER: Container = setupRootContainer();

export interface IContainer {
  get: <T>(someClass: Constructable) => T;
  getAsync: <T>(someClass: Constructable) => Promise<T>;
}
const defaultContainer: IContainer = new (class {
  public get<T>(clazz: Constructable): T {
    try {
      return APPLICATION_ROOT_CONTAINER.get(clazz);
    } catch (error) {
      console.error(`Get instance of ${clazz.name} throws \n${error}`, 'Get Instance');
      throw error;
    }
  }

  public getAsync<T>(clazz: Constructable): Promise<T> {
    return APPLICATION_ROOT_CONTAINER.getAsync(clazz);
  }
})();

/**
 * Get instance from container
 *
 * @alpha
 */
export async function getFromContainer<T>(clazz: Constructable<T>): Promise<T> {
  const instance: T = await defaultContainer.getAsync<T & IAppClassInterface>(clazz);
  return instance as T;
}

/**
 * Register a class into dependency-injection container
 * @example
 * ```typescript
 * class ThirdPartyClass {
 *  // business logic...
 * };
 *
 * registerClass(ThirdPartyClass);
 *
 * ```
 * Then the `ThirdPartyClass` will be managed by DI container in runtime.
 */
export function registerClass<T extends Constructable>(clazz: T): T {
  if (!Reflect.hasOwnMetadata(METADATA_KEY.PARAM_TYPES, clazz)) {
    decorate(injectable(), clazz);
    registerPossibleAsyncInit(clazz);
    APPLICATION_ROOT_CONTAINER.bind(clazz).toSelf().inSingletonScope();
  }

  return clazz;
}

export function registerPossibleAsyncInit<T extends Constructable>(clazz: T): void {
  if (typeof clazz.prototype.asyncInit === 'function') {
    if (!Reflect.hasOwnMetadata(METADATA_KEY.POST_CONSTRUCT, clazz.constructor)) {
      decorate(postConstruct(), clazz.prototype, 'asyncInit');
    }
  }
}
