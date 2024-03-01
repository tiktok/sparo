---
title: Overview
---

Everyday development involves a variety of Git operations such as switching between branches, fetching incremental changes from the server, and browsing history.  By contrast, when a continuous integration (CI) pipeline checks out a Git branch, it is typically a much simpler operation, and the folder or entire virtual machine image may be discarded as soon as the job completes.  Therefore, different approaches for optimizing Git require required for these two use cases.

Sparo provides a separate command line `sparo-ci` that is specifically optimized for CI pipelines.  The current implementation takes this approach:

- It uses [treeless clone](https://github.blog/2020-12-21-get-up-to-speed-with-partial-clone-and-shallow-clone/) instead of **blobless clone**, under the assumption that Git history will be rarely needed.

  _Shallow clone is a common alternative, however it has trouble supporting operations such as incremental build or publishing that require comparison with a base branch._

- Spare checkout is configured, and the [skeleton folders](../reference/skeleton_folders.md) are included.

Currently two subcommands are supported for CI:

- `sparo-ci checkout`
- `sparo-ci clone`

