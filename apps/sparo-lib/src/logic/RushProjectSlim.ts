import * as path from 'path';
import * as semver from 'semver';
import { JsonFile } from '@rushstack/node-core-library';
import { DependencySpecifier, DependencySpecifierType } from './DependencySpecifier';

export interface IProjectJson {
  packageName: string;
  projectFolder: string;
  decoupledLocalDependencies?: string[];
  cyclicDependencyProjects?: string[];
}

/**
 * A slim version of RushConfigurationProject
 */
export class RushProjectSlim {
  public packageName: string;
  public projectFolder: string;
  public relativeProjectFolder: string;
  public packageJson: {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
  };
  public decoupledLocalDependencies: Set<string>;

  private _packageNameToRushProjectSlim: Map<string, RushProjectSlim>;
  private _dependencyProjects: Set<RushProjectSlim> | undefined;
  private _consumingProjects: Set<RushProjectSlim> | undefined;

  public constructor(
    projectJson: IProjectJson,
    repoRootPath: string,
    packageNameToRushProjectSlim: Map<string, RushProjectSlim>
  ) {
    this.packageName = projectJson.packageName;
    this.projectFolder = path.resolve(repoRootPath, projectJson.projectFolder);
    this.relativeProjectFolder = projectJson.projectFolder;
    const packageJsonPath: string = path.resolve(this.projectFolder, 'package.json');
    this.packageJson = JsonFile.load(packageJsonPath);
    this._packageNameToRushProjectSlim = packageNameToRushProjectSlim;

    this.decoupledLocalDependencies = new Set<string>();
    if (projectJson.cyclicDependencyProjects || projectJson.decoupledLocalDependencies) {
      if (projectJson.cyclicDependencyProjects && projectJson.decoupledLocalDependencies) {
        throw new Error(
          'A project configuration cannot specify both "decoupledLocalDependencies" and "cyclicDependencyProjects". Please use "decoupledLocalDependencies" only -- the other name is deprecated.'
        );
      }
      for (const cyclicDependencyProject of projectJson.cyclicDependencyProjects ||
        projectJson.decoupledLocalDependencies ||
        []) {
        this.decoupledLocalDependencies.add(cyclicDependencyProject);
      }
    }
  }

  public get dependencyProjects(): ReadonlySet<RushProjectSlim> {
    if (this._dependencyProjects) {
      return this._dependencyProjects;
    }
    const dependencyProjects: Set<RushProjectSlim> = new Set<RushProjectSlim>();
    const { packageJson } = this;
    for (const dependencySet of [
      packageJson.dependencies,
      packageJson.devDependencies,
      packageJson.optionalDependencies
    ]) {
      if (dependencySet) {
        for (const [dependency, version] of Object.entries(dependencySet)) {
          const dependencySpecifier: DependencySpecifier = new DependencySpecifier(dependency, version);
          const dependencyName: string =
            dependencySpecifier.aliasTarget?.packageName ?? dependencySpecifier.packageName;
          // Skip if we can't find the local project or it's a cyclic dependency
          const localProject: RushProjectSlim | undefined =
            this._packageNameToRushProjectSlim.get(dependencyName);
          if (localProject && !this.decoupledLocalDependencies.has(dependency)) {
            // Set the value if it's a workspace project, or if we have a local project and the semver is satisfied
            switch (dependencySpecifier.specifierType) {
              case DependencySpecifierType.Version:
              case DependencySpecifierType.Range:
                if (
                  semver.satisfies(localProject.packageJson.version, dependencySpecifier.versionSpecifier)
                ) {
                  dependencyProjects.add(localProject);
                }
                break;
              case DependencySpecifierType.Workspace:
                dependencyProjects.add(localProject);
                break;
            }
          }
        }
      }
    }
    this._dependencyProjects = dependencyProjects;
    return this._dependencyProjects;
  }

  public get consumingProjects(): ReadonlySet<RushProjectSlim> {
    if (!this._consumingProjects) {
      // Force initialize all dependencies relationship
      for (const project of this._packageNameToRushProjectSlim.values()) {
        project._consumingProjects = new Set();
      }

      for (const project of this._packageNameToRushProjectSlim.values()) {
        for (const dependency of project.dependencyProjects) {
          dependency._consumingProjects!.add(project);
        }
      }
    }
    return this._consumingProjects!;
  }
}
