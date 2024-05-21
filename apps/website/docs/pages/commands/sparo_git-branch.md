---
title: sparo git-branch
---

This is the [mirrored subcommand](./overview.md) for `git branch`.  It has the same functionality as the corresponding Git subcommand, but supports Sparo's optional anonymous timing metrics collection.

```
sparo git-branch [--color[=<when>] | --no-color] [--show-current]
        [-v [--abbrev=<n> | --no-abbrev]]
        [--column[=<options>] | --no-column] [--sort=<key>]
        [--merged [<commit>]] [--no-merged [<commit>]]
        [--contains [<commit>]] [--no-contains [<commit>]]
        [--points-at <object>] [--format=<format>]
        [(-r | --remotes) | (-a | --all)]
        [--list] [<pattern>...]
sparo git-branch [--track[=(direct|inherit)] | --no-track] [-f]
        [--recurse-submodules] <branchname> [<start-point>]
sparo git-branch (--set-upstream-to=<upstream> | -u <upstream>) [<branchname>]
sparo git-branch --unset-upstream [<branchname>]
sparo git-branch (-m | -M) [<oldbranch>] <newbranch>
sparo git-branch (-c | -C) [<oldbranch>] <newbranch>
sparo git-branch (-d | -D) [-r] <branchname>...
sparo git-branch --edit-description [<branchname>]
```

See [git branch](https://git-scm.com/docs/git-branch) in the Git documentation for details.

