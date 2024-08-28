---
title: sparo git-checkout
---

这是 `git checkout` 的[mirrored子命令](./overview.md)。它具有与相应 Git 子命令相同的功能，但支持 Sparo 可选的匿名计时数据收集。

```
sparo git-checkout [-q] [-f] [-m] [<branch>]
sparo git-checkout [-q] [-f] [-m] --detach [<branch>]
sparo git-checkout [-q] [-f] [-m] [--detach] <commit>
sparo git-checkout [-q] [-f] [-m] [[-b|-B|--orphan] <new-branch>] [<start-point>]
sparo git-checkout [-f|--ours|--theirs|-m|--conflict=<style>] [<tree-ish>] [--] <pathspec>…​
sparo git-checkout [-f|--ours|--theirs|-m|--conflict=<style>] [<tree-ish>] --pathspec-from-file=<file> [--pathspec-file-nul]
sparo git-checkout (-p|--patch) [<tree-ish>] [--] [<pathspec>…​]
```

详情请参阅 Git 文档中的 [git checkout](https://git-scm.com/docs/git-checkout)。
