---
title: sparo-ci clone
---

```
sparo-ci clone <repository> [directory]

位置参数:
  repository  要克隆的远程仓库地址。                            [string] [required]
  directory   要克隆到的新目录名称。如果未显式指定目录，
              将使用源仓库的“humanish”部分
              （对于 /path/to/repo.gitService 使用 repo，对于
              host.xz:foo/.gitService 使用 foo）。
              仅当目录为空时才允许克隆到现有目录。          [string]

选项:
  --help  显示帮助                                                   [boolean]
```
