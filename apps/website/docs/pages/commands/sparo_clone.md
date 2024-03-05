---
title: sparo clone
---

```
sparo clone <repository> [directory]

Positionals:
  repository  The remote repository to clone from.           [string] [required]
  directory   The name of a new directory to clone into. The "humanish" part of
              the source repository is used if no directory is explicitly given
              (repo for /path/to/repo.gitService and foo for
              host.xz:foo/.gitService). Cloning into an existing directory is
              only allowed if the directory is empty                    [string]

Options:
  -h, --help             Show help                                     [boolean]
  -s, --skip-git-config  By default, Sparo automatically configures the
                         recommended git settings for the repository you are
                         about to clone. If you prefer not to include this step,
                         you can use the input parameter --skip-git-config
                                                      [boolean] [default: false]
  -b, --branch           Specify a branch to clone                      [string]
      --profile                                            [array] [default: []]
```
