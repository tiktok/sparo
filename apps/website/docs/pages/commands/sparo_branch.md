---
title: sparo branch
---

```
sparo branch [branch]

List, create, or delete branches

Positionals:
  branch                                                                [string]

Options:
      --help    Show help                                              [boolean]
  -d, --delete  Delete a branch. The branch must be fully merged in its upstream
                branch, or in HEAD if no upstream was set with --track or
                --set-upstream-to.                    [boolean] [default: false]
  -D            Shortcut for --delete --force         [boolean] [default: false]
```