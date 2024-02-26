import * as path from 'path';
import { type IPackageJson, PackageJsonLookup } from '@rushstack/node-core-library';

export class SparoPackage {
  private static __sparoPackageJson: IPackageJson | undefined = undefined;
  private static __sparoPackageFolder: string | undefined = undefined;

  private constructor() {}

  /**
   * The currently executing version of the "sparo" library.
   * This is the same as the Sparo tool version for that release.
   */
  public static get version(): string {
    return this._sparoPackageJson.version;
  }

  /**
   * @internal
   */
  public static get _sparoPackageJson(): IPackageJson {
    SparoPackage._ensureOwnPackageJsonIsLoaded();
    return SparoPackage.__sparoPackageJson!;
  }

  public static get _sparoPackageFolder(): string {
    SparoPackage._ensureOwnPackageJsonIsLoaded();
    return SparoPackage.__sparoPackageFolder!;
  }

  private static _ensureOwnPackageJsonIsLoaded(): void {
    if (!SparoPackage.__sparoPackageJson) {
      const packageJsonFilePath: string | undefined =
        PackageJsonLookup.instance.tryGetPackageJsonFilePathFor(__dirname);
      if (!packageJsonFilePath) {
        throw new Error('Unable to locate the package.json file for this module');
      }
      SparoPackage.__sparoPackageFolder = path.dirname(packageJsonFilePath);
      SparoPackage.__sparoPackageJson = PackageJsonLookup.instance.loadPackageJson(packageJsonFilePath);
    }
  }
}
