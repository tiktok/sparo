---
title: sparo auto-config
---

```
sparo auto-config

Automatic setup optimized git config

Options:
  -h, --help       Show help                                           [boolean]
      --overwrite                                     [boolean] [default: false]
```

You do not normally need to invoke `sparo auto-config`.  As the name implies, it is automatically applied by `sparo clone`.  This command is provided for reapplying the configuration in a situation where the user may have manually altered Sparo's configuration.  It is a good first step when investigating problems.

## Auto-config settings

The implementation can be found in [GitService.ts](https://github.com/tiktok/sparo/blob/main/apps/sparo-lib/src/services/GitService.ts).  Below is a summary of the currently applied settings:

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
