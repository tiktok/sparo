---
title: 概述
---

`git` 命令行工具支持各种子命令，例如 `git clone`、`git checkout` 等。`sparo` 命令行旨在完全替代 `git`。

Sparo 有四种类型的子命令：

1. **mirrored子命令**，例如 `sparo branch` 和 `sparo revert`，直接调用相应的 `git` 子命令。使用mirrored子命令的目的是让 Sparo 能够提供有关可能导致性能问题的参数的建议。此外，您还可以选择在 Sparo 中配置埋点数据收集，帮助您衡量在您的代码库中的使用体验。（收集的数据会发送到您自己的服务，其他任何人无法访问。）

2. **增强子命令**，其基本设计与对应的 `git` 子命令相同，但针对稀疏检出配置文件和更高效的默认设置进行了调整。共有四个增强命令：
   - `sparo checkout`
   - `sparo clone`
   - `sparo fetch`
   - `sparo pull`

3. **重命名子命令** 是四个增强子命令的mirrored版本，它们被重命名为添加了 `git-` 前缀：
  - `sparo git-checkout`
  - `sparo git-clone`
  - `sparo git-fetch`
  - `sparo git-pull`

4. **辅助子命令** 是提供 Sparo 特定功能的新子命令。它们包括：
  - `sparo auto-config`
  - `sparo init-profile`
  - `sparo list-profiles`
  - `sparo inspect` _(尚未实现，将报告工作目录状态和诊断信息)_
  - `sparo reclone` _(尚未实现，将有效地恢复到干净的克隆状态)_

## mirrored命令

每个子命令在本文档中都有自己的页面，mirrored命令除外，它们已经在 Git 文档中进行了介绍。为了方便起见，下面的表格列出了最重要的["porcelain"](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)子命令，然而每个 Git 子命令都受支持。

| 子命令 | 概述 |
| --- | --- |
| [git add](https://git-scm.com/docs/git-add) | 将文件内容添加到索引 |
| [git am](https://git-scm.com/docs/git-am) | 从邮箱中应用一系列补丁 |
| [git archive](https://git-scm.com/docs/git-archive) | 从指定树创建文件归档 |
| [git bisect](https://git-scm.com/docs/git-bisect) | 使用二分查找找到引入错误的提交 |
| [git branch](https://git-scm.com/docs/git-branch) | 列出、创建或删除分支 |
| [git bundle](https://git-scm.com/docs/git-bundle) | 通过归档移动对象和引用 |
| [git checkout](https://git-scm.com/docs/git-checkout) | 切换分支或还原工作树文件 |
| [git cherry-pick](https://git-scm.com/docs/git-cherry-pick) | 应用某些现有提交引入的更改 |
| [git citool](https://git-scm.com/docs/git-citool) | 图形化替代 git-commit |
| [git clean](https://git-scm.com/docs/git-clean) | 从工作树中删除未跟踪的文件 |
| [git clone](https://git-scm.com/docs/git-clone) | 将仓库克隆到一个新目录中 |
| [git commit](https://git-scm.com/docs/git-commit) | 将更改记录到仓库 |
| [git describe](https://git-scm.com/docs/git-describe) | 基于可用引用为对象赋予一个可读名称 |
| [git diff](https://git-scm.com/docs/git-diff) | 显示提交之间的更改、提交与工作树之间的更改等 |
| [git fetch](https://git-scm.com/docs/git-fetch) | 从另一个仓库下载对象和引用 |
| [git format-patch](https://git-scm.com/docs/git-format-patch) | 为电子邮件提交准备补丁 |
| [git gc](https://git-scm.com/docs/git-gc) | 清理不必要的文件并优化本地仓库 |
| [git gitk](https://git-scm.com/docs/git-gitk) | Git 仓库浏览器 |
| [git grep](https://git-scm.com/docs/git-grep) | 打印匹配模式的行 |
| [git gui](https://git-scm.com/docs/git-gui) | Git 的可移植图形界面 |
| [git init](https://git-scm.com/docs/git-init) | 创建一个空的 Git 仓库或重新初始化现有的仓库 |
| [git log](https://git-scm.com/docs/git-log) | 显示提交日志 |
| [git maintenance](https://git-scm.com/docs/git-maintenance) | 运行任务以优化 Git 仓库数据 |
| [git merge](https://git-scm.com/docs/git-merge) | 将两个或多个开发历史合并在一起 |
| [git mv](https://git-scm.com/docs/git-mv) | 移动或重命名文件、目录或符号链接 |
| [git notes](https://git-scm.com/docs/git-notes) | 添加或查看对象注释 |
| [git pull](https://git-scm.com/docs/git-pull) | 从另一个仓库或本地分支获取并集成 |
| [git push](https://git-scm.com/docs/git-push) | 更新远程引用及其关联对象 |
| [git range-diff](https://git-scm.com/docs/git-range-diff) | 比较两个提交范围（例如分支的两个版本） |
| [git rebase](https://git-scm.com/docs/git-rebase) | 在另一个基底上重新应用提交 |
| [git reset](https://git-scm.com/docs/git-reset) | 将当前 HEAD 重置为指定状态 |
| [git restore](https://git-scm.com/docs/git-restore) | 恢复工作树文件 |
| [git revert](https://git-scm.com/docs/git-revert) | 撤销某些现有的提交 |
| [git rm](https://git-scm.com/docs/git-rm) | 从工作树和索引中删除文件 |
| [git shortlog](https://git-scm.com/docs/git-shortlog) | 总结 'git log' 输出 |
| [git show](https://git-scm.com/docs/git-show) | 显示各种类型的对象 |
| [git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout) | 将工作树减少到跟踪文件的子集 |
| [git stash](https://git-scm.com/docs/git-stash) | 将脏的工作目录中的更改暂存 |
| [git status](https://git-scm.com/docs/git-status) | 显示工作树状态 |
| [git submodule](https://git-scm.com/docs/git-submodule) | 初始化、更新或查看子模块 |
| [git switch](https://git-scm.com/docs/git-switch) | 切换分支 |
| [git tag](https://git-scm.com/docs/git-tag) | 创建、列出、删除或验证使用 GPG 签名的标签对象 |
| [git worktree](https://git-scm.com/docs/git-worktree) | 管理多个工作树 |
| . . . | _...以及许多其他子命令，包括 shell `PATH` 中找到的任何自定义命令_ |

