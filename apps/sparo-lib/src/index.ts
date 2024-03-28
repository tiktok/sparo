export { Sparo, type ILaunchOptions } from './api/Sparo';

export { getFromContainerAsync } from './di/container';

export { GitService, type IExecuteGitCommandParams, type IObjectType } from './services/GitService';
export { TerminalService, type ITerminal } from './services/TerminalService';

export type { ICollectTelemetryFunction, ITelemetryData } from './services/TelemetryService';
export type { ICallerPackageJson } from './cli/SparoStartupBanner';
