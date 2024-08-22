---
title: 概述
---

日常开发涉及各种 Git 操作，例如在分支之间切换、从服务器获取增量更改以及浏览历史记录。相比之下，当持续集成 (CI) 流水线签出一个 Git 分支时，通常是一个更简单的操作。文件夹或整个虚拟机mirrored可能在作业完成后立即被丢弃。因此，这两种用例需要不同的 Git 优化方法。

Sparo 提供了一个单独的命令行工具 `sparo-ci`，专门针对 CI 流水线进行了优化。当前实现采用以下方法：

- 使用 [treeless clone](https://github.blog/2020-12-21-get-up-to-speed-with-partial-clone-and-shallow-clone/) 而非 **blobless clone**，假设很少需要使用 Git 历史记录。

  _Shallow clone 是一种常见的替代方案，但在支持需要与基准分支进行比较的增量构建或发布操作时会遇到困难。_

- 配置了稀疏签出，并包含了[骨架文件夹](../reference/skeleton_folders.md)。

目前，`sparo-ci` 支持两个子命令用于 CI：

- `sparo-ci checkout`
- `sparo-ci clone`
