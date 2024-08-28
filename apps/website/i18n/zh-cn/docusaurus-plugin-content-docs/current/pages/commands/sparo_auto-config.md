---
title: sparo auto-config
---

```
sparo auto-config

自动设置推荐的 Git 配置

选项:
  -h, --help       显示帮助                                           [boolean]
      --overwrite                                     [boolean] [default: false]
```

通常，您不需要手动调用 `sparo auto-config`。顾名思义，它由 `sparo clone` 自动应用。该命令提供用于在用户可能手动更改了 Sparo 配置的情况下重新应用配置。当调查问题时，这是一个不错的第一步。

## 自动配置设置

实现可以在 [GitService.ts](https://github.com/tiktok/sparo/blob/main/apps/sparo-lib/src/services/GitService.ts) 中找到。以下是当前应用设置的摘要：

```
pull.rebase=true
fetch.prune=true
fetch.showForcedUpdates=false
feature.manyFiles=true
core.fsmonitor=true
core.fscache=true
core.untrackedcache=true
oh-my-zsh.hide-status=1
oh-my-zsh.hide-dirty=1
lfs.allowincompletepush=true
lfs.concurrenttransfers=32
push.autoSetupRemote=true
```
