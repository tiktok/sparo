---
title: sparo checkout
---

```
sparo checkout [branch] [start-point]

Updates files in the working tree to match the version in the index or the
specified tree. If no pathspec was given, git checkout will also update HEAD to
set the specified branch as the current branch.

Positionals:
  branch                                                                [string]
  start-point                                                           [string]

Options:
  -h, --help         Show help                                         [boolean]
  -b                 Create a new branch and start it at <start-point> [boolean]
  -B                 Create a new branch and start it at <start-point>; if it
                     already exists, reset it to <start-point>         [boolean]
      --profile                                            [array] [default: []]
      --add-profile                                        [array] [default: []]
```
