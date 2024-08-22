---
title: sparo git-clone
---

这是 `git clone` 的[镜像子命令](./overview.md)。它具有与相应 Git 子命令相同的功能，但支持 Sparo 可选的匿名计时数据收集。

```
sparo git-clone [--template=<template-directory>]
	  [-l] [-s] [--no-hardlinks] [-q] [-n] [--bare] [--mirror]
	  [-o <name>] [-b <name>] [-u <upload-pack>] [--reference <repository>]
	  [--dissociate] [--separate-git-dir <git-dir>]
	  [--depth <depth>] [--[no-]single-branch] [--no-tags]
	  [--recurse-submodules[=<pathspec>]] [--[no-]shallow-submodules]
	  [--[no-]remote-submodules] [--jobs <n>] [--sparse] [--[no-]reject-shallow]
	  [--filter=<filter> [--also-filter-submodules]] [--] <repository>
	  [<directory>]
```

详情请参阅 Git 文档中的 [git clone](https://git-scm.com/docs/git-clone)。
