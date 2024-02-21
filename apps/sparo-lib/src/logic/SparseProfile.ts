import { JsonFile, JsonSchema } from '@rushstack/node-core-library';
import schemaJson from '../schemas/sparse-profile.schema.json';
import { LogService } from '../services/LogService';
import { Service } from '../decorator';

// https://rushjs.io/pages/developer/selecting_subsets/
export type Selector = '--to' | '--from';

export interface ISelection {
  selector: Selector;
  argument: string;
}

export interface IRushSelectors {
  toSelectors: Set<string>;
  fromSelectors: Set<string>;
}
export interface ISparseProfileJson {
  selections?: ISelection[];
  includeFolders?: string[];
  excludeFolders?: string[];
}

export interface ISparseProfileParams {
  logService: LogService;
}

@Service()
export class SparseProfile {
  private static _jsonSchema: JsonSchema = JsonSchema.fromLoadedObject(schemaJson);

  public readonly selections: ISelection[];
  public readonly includeFolders: string[];
  public readonly excludeFolders: string[];
  public readonly rushSelectors: IRushSelectors = {
    toSelectors: new Set(),
    fromSelectors: new Set()
  };

  private readonly _sparseProfileJson: ISparseProfileJson;
  private _logService: LogService;

  public constructor(logService: LogService, sparseProfileJson: ISparseProfileJson) {
    this._logService = logService;
    this._sparseProfileJson = sparseProfileJson;

    const { selections, includeFolders, excludeFolders } = this._sparseProfileJson;
    this.selections = selections || [];
    this.includeFolders = includeFolders || [];
    this.excludeFolders = excludeFolders || [];

    if (selections) {
      const { toSelectors, fromSelectors } = this.rushSelectors;

      for (const selection of selections) {
        switch (selection.selector) {
          case '--to': {
            toSelectors.add(selection.argument);
            break;
          }
          case '--from': {
            fromSelectors.add(selection.argument);
            break;
          }
          default: {
            this._logService.logger.error(`Error, unknown selector ${selection.selector}`);
            break;
          }
        }
      }
    }
  }

  public static async loadFromFileAsync(
    logService: LogService,
    jsonFilepath: string
  ): Promise<SparseProfile> {
    const sparseProfileJson: ISparseProfileJson = await JsonFile.loadAndValidateAsync(
      jsonFilepath,
      SparseProfile._jsonSchema
    );
    return new SparseProfile(logService, sparseProfileJson);
  }
}
