---
title: sparo clone
---

```
sparo clone <repository> [directory]

位置参数：
  repository  要克隆的远程仓库。                              [string] [required]
  directory   要克隆到的新目录名称。如果未明确指定目录名称，则使用源仓库的
              “人性化”部分（对于 /path/to/repo.gitService 使用 repo，对于
              host.xz:foo/.gitService 使用 foo）。仅当目录为空时，才允许克隆
              到现有目录中。                                           [string]

选项：
  -h, --help             显示帮助                                      [boolean]
  -s, --skip-git-config  默认情况下，Sparo 会自动配置您即将克隆的仓库的推荐
                         git 设置。如果您不希望包含此步骤，可以使用输入参数
                         --skip-git-config                    [boolean] [default: false]
  -b, --branch           指定要克隆的分支                                [string]
      --profile                                            [array] [default: []]
```
