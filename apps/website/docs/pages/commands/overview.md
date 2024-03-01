---
title: Overview
---

The `git` command-line tool supports various subcommands such as `git clone`, `git checkout`, and so forth.  The `sparo` command-line is intended to be a complete replacement for `git`.

Sparo has four kinds of subcommands:

1. **Mirrored subcommands** such as `sparo branch` and `sparo revert` directly invoke the corresponding `git` version of that subcommand.  The motivation for using mirrored subcommands is to enable Sparo to provide advice about parameters that may cause performance issues.  Additionally, you can optionally configure Sparo to collect anonymized usage metrics to help you measure the experience in your repository.  (Collected data is sent to your own service. It is not accessible by any other party.)

2. **Enhanced subcommands** follow the same basic design as their `git` counterparts, but with adaptations for sparse checkout profiles and more efficient defaults.  There are four enhanced commands:
   - `sparo checkout`
   - `sparo clone`
   - `sparo fetch`
   - `sparo pull` (not implemented yet; currently mirrors `git pull`)

3. **Renamed subcommands** are the mirrored versions of the four enhanced subcommands. They are renamed to add a `git-` prefix:
  - `sparo git-checkout`
  - `sparo git-clone`
  - `sparo git-fetch`
  - `sparo git-pull` (not implemented yet)

4. **Auxiliary subcommands** are new subcommands that provide Sparo-specific functionality.  They are:
  - `sparo auto-config`
  - `sparo init-profile`
  - `sparo list-profiles`
  - `sparo inspect` (not implemented yet, reports working directory status and diagnostics)
  - `sparo reclone` (not implemented yet, will efficiently revert to a clean clone)

## Mirrored commands

Each subcommand has its own page in this documentation, except for the mirrored commands which are already covered by the Git documentation.  For convenience, the most essential ["porcelain"](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain) subcommands are listed in the table below, however every Git subcommand is supported.

| Subcommand | Summary |
| --- | --- |
| [git add](https://git-scm.com/docs/git-add) | Add file contents to the index |
| [git am](https://git-scm.com/docs/git-am) | Apply a series of patches from a mailbox |
| [git archive](https://git-scm.com/docs/git-archive) | Create an archive of files from a named tree |
| [git bisect](https://git-scm.com/docs/git-bisect) | Use binary search to find the commit that introduced a bug |
| [git branch](https://git-scm.com/docs/git-branch) | List, create, or delete branches |
| [git bundle](https://git-scm.com/docs/git-bundle) | Move objects and refs by archive |
| [git checkout](https://git-scm.com/docs/git-checkout) | Switch branches or restore working tree files |
| [git cherry-pick](https://git-scm.com/docs/git-cherry-pick) | Apply the changes introduced by some existing commits |
| [git citool](https://git-scm.com/docs/git-citool) | Graphical alternative to git-commit |
| [git clean](https://git-scm.com/docs/git-clean) | Remove untracked files from the working tree |
| [git clone](https://git-scm.com/docs/git-clone) | Clone a repository into a new directory |
| [git commit](https://git-scm.com/docs/git-commit) | Record changes to the repository |
| [git describe](https://git-scm.com/docs/git-describe) | Give an object a human readable name based on an available ref |
| [git diff](https://git-scm.com/docs/git-diff) | Show changes between commits, commit and working tree, etc |
| [git fetch](https://git-scm.com/docs/git-fetch) | Download objects and refs from another repository |
| [git format-patch](https://git-scm.com/docs/git-format-patch) | Prepare patches for e-mail submission |
| [git gc](https://git-scm.com/docs/git-gc) | Cleanup unnecessary files and optimize the local repository |
| [git gitk](https://git-scm.com/docs/git-gitk) | The Git repository browser |
| [git grep](https://git-scm.com/docs/git-grep) | Print lines matching a pattern |
| [git gui](https://git-scm.com/docs/git-gui) | A portable graphical interface to Git |
| [git init](https://git-scm.com/docs/git-init) | Create an empty Git repository or reinitialize an existing one |
| [git log](https://git-scm.com/docs/git-log) | Show commit logs |
| [git maintenance](https://git-scm.com/docs/git-maintenance) | Run tasks to optimize Git repository data |
| [git merge](https://git-scm.com/docs/git-merge) | Join two or more development histories together |
| [git mv](https://git-scm.com/docs/git-mv) | Move or rename a file, a directory, or a symlink |
| [git notes](https://git-scm.com/docs/git-notes) | Add or inspect object notes |
| [git pull](https://git-scm.com/docs/git-pull) | Fetch from and integrate with another repository or a local branch |
| [git push](https://git-scm.com/docs/git-push) | Update remote refs along with associated objects |
| [git range-diff](https://git-scm.com/docs/git-range-diff) | Compare two commit ranges (e.g. two versions of a branch) |
| [git rebase](https://git-scm.com/docs/git-rebase) | Reapply commits on top of another base tip |
| [git reset](https://git-scm.com/docs/git-reset) | Reset current HEAD to the specified state |
| [git restore](https://git-scm.com/docs/git-restore) | Restore working tree files |
| [git revert](https://git-scm.com/docs/git-revert) | Revert some existing commits |
| [git rm](https://git-scm.com/docs/git-rm) | Remove files from the working tree and from the index |
| [git shortlog](https://git-scm.com/docs/git-shortlog) | Summarize 'git log' output |
| [git show](https://git-scm.com/docs/git-show) | Show various types of objects |
| [git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout) | Reduce your working tree to a subset of tracked files |
| [git stash](https://git-scm.com/docs/git-stash) | Stash the changes in a dirty working directory away |
| [git status](https://git-scm.com/docs/git-status) | Show the working tree status |
| [git submodule](https://git-scm.com/docs/git-submodule) | Initialize, update or inspect submodules |
| [git switch](https://git-scm.com/docs/git-switch) | Switch branches |
| [git tag](https://git-scm.com/docs/git-tag) | Create, list, delete or verify a tag object signed with GPG |
| [git worktree](https://git-scm.com/docs/git-worktree) | Manage multiple working trees |
| . . . | _...and many other subcommands including any custom commands found in the shell `PATH`_ |

