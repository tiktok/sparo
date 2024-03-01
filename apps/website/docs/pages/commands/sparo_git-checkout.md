---
title: sparo git-checkout
---

This is the [mirrored subcommand](./overview.md) for `git checkout`.  It has the same functionality as the corresponding Git subcommand, but supports Sparo's optional anonymous timing metrics collection.

```
sparo git-checkout [-q] [-f] [-m] [<branch>]
sparo git-checkout [-q] [-f] [-m] --detach [<branch>]
sparo git-checkout [-q] [-f] [-m] [--detach] <commit>
sparo git-checkout [-q] [-f] [-m] [[-b|-B|--orphan] <new-branch>] [<start-point>]
sparo git-checkout [-f|--ours|--theirs|-m|--conflict=<style>] [<tree-ish>] [--] <pathspec>…​
sparo git-checkout [-f|--ours|--theirs|-m|--conflict=<style>] [<tree-ish>] --pathspec-from-file=<file> [--pathspec-file-nul]
sparo git-checkout (-p|--patch) [<tree-ish>] [--] [<pathspec>…​]
```

See [git checkout](https://git-scm.com/docs/git-checkout) in the Git documentation for details.
