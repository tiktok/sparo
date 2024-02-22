---
title: Overview
hide_title: true
custom_edit_url: null
---

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <img src="images/site/sparo-logo.svg" alt="Sparo" title="Sparo" style={{ width: '380px', paddingTop: '30px' }} />
</div>

## Clone faster!

Sparo optimizes performance of Git operations for your large frontend monorepo.

<!-- Text below this line should stay in sync with the project and repo README.md -->
<!-- ---------------------------------------------------------------------------- -->

## Key features

- **Familiar interface:** The `sparo` command-line interface (CLI) wrapper offers **better defaults** and **performance suggestions** without altering the familiar `git` syntax. (The native `git` CLI is also supported.)
- **A proven solution:** Git provides [quite a lot of ingredients](./pages/reference/git_optimization.md) for optimizing very large repos; Sparo is your recipe for combining these features intelligently.
- **Simplified sparse checkout:** Work with sparse checkout [profiles](./pages/guide/sparo_profiles.md) instead of confusing "cones" and globs
- **Frontend integration:** Sparo leverages [Rush](https://rushjs.io/) and [PNPM](https://pnpm.io/) workspace configurations, including the ability to automatically checkout project dependencies
- **Dual workflows:** The `sparo-ci` tool implements a specialized checkout model optimized for continuous integration (CI) pipelines
- **Extra safeguards**: Avoid common Git mistakes such as checkouts with staged files outside the active view
- **Go beyond Git hooks:** Optionally collect anonymized Git timing metrics in your monorepo, enabling your build team to set data-driven goals for _local_ developer experience (not just CI!)

  _(Metrics are transmitted to your own service and are not accessible by any other party.)_

<!-- ---------------------------------------------------------------------------- -->
<!-- Text above this line should stay in sync with the project and repo README.md -->

## Quick demo

Try out Sparo in 5 easy steps:

1. Ensure you are using the latest Git version. For macOS, we recommend to use [brew install git](https://git-scm.com/download/mac).  For other operating systems, see the [Git documentation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for instructions.

2. Clone your [RushJS](https://rushjs.io/) monorepo:

   ```shell
   sparo clone https://github.com/my-company/my-monorepo.git
   ```

   👉 _For a real world demo, try this repo:_
   [https://github.com/Azure/azure-sdk-for-js.git](https://github.com/Azure/azure-sdk-for-js.git)

   > 💡 Support for PNPM and Yarn workspaces is planned but not implemented yet. Contributions welcome!

3. Define a [Sparo profile](./pages/configs/profile_json.md) describing the subset of repository folders for Git sparse checkout.  Here is a basic example:

   **common/sparo-profiles/my-team.json**
   ```json
   {
     "selections": [
        {
          "selector": "--to",
          "argument": "my-rush-project"
        }
     ]
   }
   ```
   The `--to` [project selector](https://rushjs.io/pages/developer/selecting_subsets/#--to) instructs Sparo to checkout all dependencies in the workspace that are required to build `my-rush-project`.

   👉 _If you're demoing **azure-sdk-for-js**, replace `my-rush-project` with `@azure/arm-commerce`._

4. Check out your Sparo profile:

   ```shell
   sparo checkout --profile my-team
   ```

5. For everyday work, consider choosing [mirrored subcommands](./pages/commands/overview.md) such as `sparo revert` instead of `git revert`. The Sparo wrapper provides (1) better defaults, (2) suggestions for better performance, and (3) optional anonymized performance metrics.

   Examples:

   ```shell
   sparo pull

   sparo commit -m "Example command"
   ```

