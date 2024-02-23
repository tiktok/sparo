import * as path from 'path';
import { type IPackageJson, PackageJsonLookup } from '@rushstack/node-core-library';

export class SparoVersion {
  private static __sparoLibPackageJson: IPackageJson | undefined = undefined;
  private static __sparoLibPackageFolder: string | undefined = undefined;

  private constructor() {}

  /**
   * The currently executing version of the "sparo-lib" library.
   * This is the same as the Sparo tool version for that release.
   */
  public static get version(): string {
    return this._sparoLibPackageJson.version;
  }

  /**
   * @internal
   */
  public static get _sparoLibPackageJson(): IPackageJson {
    SparoVersion._ensureOwnPackageJsonIsLoaded();
    return SparoVersion.__sparoLibPackageJson!;
  }

  public static get _sparoLibPackageFolder(): string {
    SparoVersion._ensureOwnPackageJsonIsLoaded();
    return SparoVersion.__sparoLibPackageFolder!;
  }

  private static _ensureOwnPackageJsonIsLoaded(): void {
    if (!SparoVersion.__sparoLibPackageJson) {
      const packageJsonFilePath: string | undefined =
        PackageJsonLookup.instance.tryGetPackageJsonFilePathFor(__dirname);
      if (!packageJsonFilePath) {
        throw new Error('Unable to locate the package.json file for this module');
      }
      SparoVersion.__sparoLibPackageFolder = path.dirname(packageJsonFilePath);
      SparoVersion.__sparoLibPackageJson = PackageJsonLookup.instance.loadPackageJson(packageJsonFilePath);
    }
  }
}
