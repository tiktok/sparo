---
title: Git optimization
---

By default `git clone` will download every file in your Git repository, as well as the complete history of every file. For small repositories, that's no big deal. But as your monorepo accumulates projects and years of history, Git operations become slower and slower, until one day `git status` is taking 10 seconds or more. What to do?

Git provides these basic solutions that are easy to use in a medium sized repository:

- **Shallow clone** allows cloning only a few commits, but is generally only suitable for throwaway clones such as a CI job.

- **Partial clone** allows cloning without file contents (**blobless** clone) or even commit details (**treeless** clone), greatly accelerating your `git clone` time and allowing such details to be fetched during `git checkout`.

- **Large file storage (LFS)** can move binary files to a separate server, downloading them on demand during checkout. Configuration of LFS is tricky however and if done incorrectly may cause worse performance.

However, achieving good performance in a large repository requires more complex Git features such as:

- Git **filesystem monitor** and **background maintenance** are background processes that watch for changes and periodically prefetch server data. The user must manually register/unregister working directories and remember to "pause" the service when not needed.

- **Git worktrees** allow multiple working directories on your computer to share a single `.git` folder, avoiding the cost of multiple clones. However this feature comes with awkward limitations, for example the same branch can't be checked out in two worktrees, and Git hooks are also shared.

- **Sparse checkout** allows `git checkout` to extract a subset of files instead of the entire directory structure. Combined with partial clone, sparse checkout is the "battle axe" of Git optimization: although irrelevant projects and history will accumulate, your wait time will be proportional to the files you actually need. 
 