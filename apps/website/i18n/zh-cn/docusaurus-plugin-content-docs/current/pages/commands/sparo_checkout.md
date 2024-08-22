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
      --help         Show help                                         [boolean]
  -b                 Create a new branch and start it at <start-point> [boolean]
  -B                 Create a new branch and start it at <start-point>; if it
                     already exists, reset it to <start-point>         [boolean]
      --profile      Checkout projects by specified profile(s). The profiles
                     will be recorded and reused by other sparo commands. For
                     example, running "sparo checkout <branch>" sparse checkout
                     based on the reused profiles after running "git checkout"
                                                           [array] [default: []]
      --add-profile  Checkout projects with recorded profile(s) and the
                     specified added profile(s). Adds the specified added
                     profile(s) to sparo recorded profiles [array] [default: []]
      --no-profile   Checkout projects without any profiles and clear all
                     recorded profiles                                 [boolean]
      --to           Checkout projects up to (and including) project <to..>, can
                     be used together with option --profile/--add-profile to
                     form a union selection of the two options. The projects
                     selectors here will never replace what have been checked
                     out by profiles                       [array] [default: []]
      --from         Checkout projects downstream from (and including itself and
                     all its dependencies) project <from..>, can be used
                     together with option --profile/--add-profile to form a
                     union selection of the two options. The projects selectors
                     here will never replace what have been checked out by
                     profiles                              [array] [default: []]
```




