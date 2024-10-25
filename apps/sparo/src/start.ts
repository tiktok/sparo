import { Sparo, type ILaunchOptions } from 'sparo-lib';
import { SparoPackage } from './SparoPackage';

const launchOptions: ILaunchOptions = {
  callerPackageJson: SparoPackage._sparoPackageJson
};

Sparo.launchSparoAsync(launchOptions).catch(console.error);

// TEST CHANGE - DO NOT MERGE
