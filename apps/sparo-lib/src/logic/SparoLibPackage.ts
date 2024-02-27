import * as path from 'path';
import { type IPackageJson, PackageJsonLookup } from '@rushstack/node-core-library';

export class SparoLibPackage {
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
    SparoLibPackage._ensureOwnPackageJsonIsLoaded();
    return SparoLibPackage.__sparoLibPackageJson!;
  }

  public static get _sparoLibPackageFolder(): string {
    SparoLibPackage._ensureOwnPackageJsonIsLoaded();
    return SparoLibPackage.__sparoLibPackageFolder!;
  }

  private static _ensureOwnPackageJsonIsLoaded(): void {
    if (!SparoLibPackage.__sparoLibPackageJson) {
      const packageJsonFilePath: string | undefined =
        PackageJsonLookup.instance.tryGetPackageJsonFilePathFor(__dirname);
      if (!packageJsonFilePath) {
        throw new Error('Unable to locate the package.json file for this module');
      }
      SparoLibPackage.__sparoLibPackageFolder = path.dirname(packageJsonFilePath);
      SparoLibPackage.__sparoLibPackageJson = PackageJsonLookup.instance.loadPackageJson(packageJsonFilePath);
    }
  }
}
