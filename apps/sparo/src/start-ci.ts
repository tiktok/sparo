import { Sparo, type ILaunchOptions } from 'sparo-lib';
import { SparoPackage } from './SparoPackage';

const launchOptions: ILaunchOptions = {
  callerPackageJson: SparoPackage._sparoPackageJson
};

Sparo.launchSparoCIAsync(launchOptions).catch(console.error);
