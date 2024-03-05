---
title: Overview
hide_title: true
custom_edit_url: null
---

import { ThemedImage } from '@site/src/components/ThemedImage';

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <ThemedImage
    srcLight="images/site/sparo-logo.svg"
    srcDark="images/site/sparo-logo-dark.svg"
    alt="Sparo"
    title="Sparo"
    style={{ width: '380px', paddingTop: '30px' }}
    />
</div>



## Clone faster!

Sparo optimizes performance of Git operations for your large frontend monorepo.

<!-- Text below this line should stay in sync with the project and repo README.md -->
<!-- ---------------------------------------------------------------------------- -->

## Key features

- **Familiar interface:** The `sparo` command-line interface (CLI) wrapper offers **better defaults** and **performance suggestions** without altering the familiar `git` syntax. (The native `git` CLI is also supported.)
- **A proven solution:** Git provides [quite a lot of ingredients](https://tiktok.github.io/sparo/pages/reference/git_optimization/) for optimizing very large repos; Sparo is your recipe for combining these features intelligently.
- **Simplified sparse checkout:** Work with sparse checkout [profiles](https://tiktok.github.io/sparo/pages/guide/sparo_profiles/) instead of confusing "cones" and globs
- **Frontend integration:** Sparo leverages [Rush](https://rushjs.io/) and [PNPM](https://pnpm.io/) workspace configurations, including the ability to automatically checkout project dependencies
- **Dual workflows:** The `sparo-ci` tool implements a specialized checkout model optimized for continuous integration (CI) pipelines
- **Extra safeguards**: Avoid common Git mistakes such as checkouts with staged files outside the active view
- **Go beyond Git hooks:** Optionally collect anonymized Git timing metrics in your monorepo, enabling your build team to set data-driven goals for _local_ developer experience (not just CI!)

  _(Metrics are transmitted to your own service and are not accessible by any other party.)_

<!-- ---------------------------------------------------------------------------- -->
<!-- Text above this line should stay in sync with the project and repo README.md -->

## Quick demo

Try out Sparo in 5 easy steps:

1. _**Upgrade to the latest Git version!**_ For macOS, we recommend to use [brew install git](https://git-scm.com/download/mac).  For other operating systems, see the [Git documentation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for instructions.

2. For this demo, we'll use the Azure SDK which is a large public [RushJS](https://rushjs.io/) monorepo from GitHub.  The following command will check out the [skeleton folders](./pages/reference/skeleton_folders.md) but not the source code:

   ```shell
   sparo clone https://github.com/Azure/azure-sdk-for-js.git

   cd azure-sdk-for-js
   ```

   > 💡 Support for PNPM and Yarn workspaces is planned but not implemented yet. Contributions welcome!

3. Define a [Sparo profile](./pages/configs/profile_json.md) describing the subset of repository folders for Git sparse checkout.

   ```shell
   # Writes a template to common/sparo-profiles/my-team.json
   sparo init-profile --profile my-team
   ```

   Edit the created **my-team.json** file to add this selector:

   **common/sparo-profiles/my-team.json**
   ```json
   {
     "selections": [
        {
          // This demo profile will check out the "@azure/arm-commerce" project
          // and all of its dependencies:
          "selector": "--to",
          "argument": "@azure/arm-commerce"
        }
     ]
   }
   ```
   The `--to` [project selector](https://rushjs.io/pages/developer/selecting_subsets/#--to) instructs Sparo to checkout all dependencies in the workspace that are required to build `my-rush-project`.



4. After saving your changes to **my-team.json**, now it's time to apply it:

   ```shell
   sparo checkout --profile my-team
   ```

   Try it out!  For example:

   ```shell
   rush install

   # The build should succeed because Sparo ensured that dependency projects
   # were included in the sparse checkout:
   rush build --to @azure/arm-commerce
   ```

5. For everyday work, consider choosing [mirrored subcommands](./pages/commands/overview.md) such as `sparo revert` instead of `git revert`. The Sparo wrapper provides (1) better defaults, (2) suggestions for better performance, and (3) optional anonymized performance metrics.

   Examples:

   ```shell
   sparo pull

   sparo commit -m "Example command"
   ```

👍👍 This concludes the **Quick Demo.**  For a more detailed walkthrough, proceed to [Getting Started](./pages/guide/getting_started.md).