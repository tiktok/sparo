
<img width="380" src="./common/assets/sparo-380.png" alt="Sparo" />

> 🚧 UNDER CONSTRUCTION 🚧
>
> This project is still under development.
> It is not yet ready for general usage.
> If you have questions or feedback, let us know
> using [GitHub discussions](https://github.com/tiktok/sparo/discussions).

## Monorepo for Sparo toolkit

<!-- Text below this line should stay in sync with the website index.md -->
<!-- ------------------------------------------------------------------ -->

**Sparo** optimizes performance of Git operations for your large frontend monorepo.

## Key features

- **Familiar interface:** The `sparo` command-line interface (CLI) wrapper offers **better defaults** and **performance suggestions** without altering the familiar `git` syntax. (The native `git` CLI is also supported.)
- **A proven solution:** Git provides [quite a lot of ingredients](./pages/guide/git_features.md) for optimizing very large repos; Sparo is your recipe for combining these features intelligently.
- **Simplified sparse checkout:** Work with sparse checkout [profiles](./pages/guide/sparo_profiles.md) instead of confusing "cones" and globs
- **Frontend integration:** Sparo leverages [Rush](https://rushjs.io/) and [PNPM](https://pnpm.io/) workspace configurations, including the ability to automatically checkout project dependencies
- **Dual workflows:** The `sparo-ci` tool implements a specialized checkout model optimized for continuous integration (CI) pipelines
- **Extra safeguards**: Avoid common Git mistakes such as checkouts with staged files outside the active view
- **Go beyond Git hooks:** Optionally collect anonymized Git timing metrics in your monorepo, enabling your build team to set data-driven goals for _local_ developer experience (not just CI!)

  _(Metrics are transmitted to your own service and are not accessible by any other party.)_

<!-- ------------------------------------------------------------------ -->
<!-- Text above this line should stay in sync with the website index.md -->

For details, consult the [Sparo documentation](./apps/sparo/README.md).

<!-- GENERATED PROJECT SUMMARY START -->

## Published Packages

<!-- the table below was generated using the ./repo-scripts/repo-toolbox script -->

| Folder | Version | Changelog | Package |
| ------ | ------- | --------- | ------- |
| [/apps/sparo](./apps/sparo/) | [![npm version](https://badge.fury.io/js/sparo.svg)](https://badge.fury.io/js/sparo) | [changelog](./apps/sparo/CHANGELOG.md) | [sparo](https://www.npmjs.com/package/sparo) |
| [/apps/sparo-lib](./apps/sparo-lib/) | [![npm version](https://badge.fury.io/js/sparo-lib.svg)](https://badge.fury.io/js/sparo-lib) | | [sparo-lib](https://www.npmjs.com/package/sparo-lib) |


## Unpublished Local Projects

<!-- the table below was generated using the ./repo-scripts/repo-toolbox script -->

| Folder | Description |
| ------ | -----------|
| [/apps/website](./apps/website/) | The Sparo documentation website |
<!-- GENERATED PROJECT SUMMARY END -->

## Contributing

Building the projects in this monorepo:

1. Install the [RushJS](https://rushjs.io/) tool:

   ```shell
   npm install -g @microsoft/rush
   ```

2. Clone the repo:

   ```shell
   git clone https://github.com/tiktok/sparo.git
   ```

3. Install the dependencies

   ```shell
   cd sparo
   rush install
   ```

4. Build all projects

   ```shell
   rush build
   ```

How to invoke your locally build `sparo` command:

```shell
cd apps/sparo
node lib/start.js
```
