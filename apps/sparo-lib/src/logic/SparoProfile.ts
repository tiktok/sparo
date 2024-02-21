import { JsonFile, JsonSchema } from '@rushstack/node-core-library';
import schemaJson from '../schemas/sparo-profile.schema.json';
import { TerminalService } from '../services/TerminalService';
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
export interface ISparoProfileJson {
  selections?: ISelection[];
  includeFolders?: string[];
  excludeFolders?: string[];
}

export interface ISparoProfileParams {
  terminalService: TerminalService;
}

@Service()
export class SparoProfile {
  private static _jsonSchema: JsonSchema = JsonSchema.fromLoadedObject(schemaJson);

  public readonly selections: ISelection[];
  public readonly includeFolders: string[];
  public readonly excludeFolders: string[];
  public readonly rushSelectors: IRushSelectors = {
    toSelectors: new Set(),
    fromSelectors: new Set()
  };

  private readonly _sparoProfileJson: ISparoProfileJson;
  private _terminalService: TerminalService;

  public constructor(terminalService: TerminalService, sparoProfileJson: ISparoProfileJson) {
    this._terminalService = terminalService;
    this._sparoProfileJson = sparoProfileJson;

    const { selections, includeFolders, excludeFolders } = this._sparoProfileJson;
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
            throw new Error(`Unknown selector "${selection.selector}"`);
          }
        }
      }
    }
  }

  public static async loadFromFileAsync(
    terminalService: TerminalService,
    jsonFilepath: string
  ): Promise<SparoProfile> {
    const sparoProfileJson: ISparoProfileJson = await JsonFile.loadAndValidateAsync(
      jsonFilepath,
      SparoProfile._jsonSchema
    );
    return new SparoProfile(terminalService, sparoProfileJson);
  }
}
