---
title: Skeleton folders
---

By default `sparo clone` initializes a sparse checkout that does not include any Sparo profile selections, but does include folders containing essential config files such as **package-lock.yaml** and **package.json**.  We call this starting point the checkout **"skeleton"** because it shows the full tree of all project folders in your monorepo, but without their source code subfolders.  In other words, although the source files for each project are excluded, the skeleton nonetheless allows engineers to remain aware of other team's projects, and how their own project relates to those other projects.  This discourages "tunnel vision" (where engineers pretend their project is the only project in the repository), while still ensuring fast Git performance.

Because Sparo enables the "cone mode" optimization for Git sparse checkout, the skeleton uses globs to match entire folders, not individual files.

## Skeleton spec

The included folders are as follows:

- The entire `common/**` folder, which generally includes all the important config files and autoinstallers for Rush operations
- For every project defined in **rush.json**, the top-level project folder contents.  For example, **packages/my-app/package.json** and **packages/my-app/README.md** will be included, but not **packages/my-app/src/index.ts**.
- The `scripts/**` and `plugins/**` top-level folders, because these names are commonly used for other essential projects.

When a Sparo profile is chosen (for example using `sparo checkout --profile my-team`), it will bring in all the source code subfolders under the selected workspace projects.

## Handling of nested projects

It is not a best practice for a workspace project to be nested under another workspace project.  For example, this folder organization should be avoided:

- **packages/x/package.json**
- **packages/x/src/index.ts**
- **packages/x/y/package.json**  (project `y` is nested inside project `x` -- don't do this)
- **packages/x/y/src/index.ts**

Sparo correctly supports this scenario, however.  For example, if your profile selects `x` but not `y`, then the checkout will include **x/src/index.ts** but exclude **x/y/src/index.ts**.
