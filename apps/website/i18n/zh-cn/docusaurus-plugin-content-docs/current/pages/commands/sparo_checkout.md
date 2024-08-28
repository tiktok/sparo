---
title: sparo checkout
---

```
sparo checkout [branch] [start-point]

更新工作树中的文件，以匹配索引或指定树中的版本。如果未提供路径规范，
git checkout 还将更新 HEAD，将指定分支设置为当前分支。

位置参数：
  branch                                                                 [string]
  start-point                                                            [string]

选项：
      --help         显示帮助                                            [boolean]
  -b                 创建一个新分支，并在 <start-point> 处启动           [boolean]
  -B                 创建一个新分支，并在 <start-point> 处启动；如果已存在，
                     将其重置到 <start-point>                           [boolean]
      --profile      根据指定的配置文件检出项目。这些配置文件将被记录，
                     并被其他 sparo 命令重用。例如，在运行 "sparo checkout <branch>"
                     后，会基于重用的配置文件进行稀疏检出                 [array] [default: []]
      --add-profile  使用记录的配置文件和指定的附加配置文件检出项目。
                     将指定的附加配置文件添加到 sparo 记录的配置文件中  [array] [default: []]
      --no-profile   检出项目时不使用任何配置文件，并清除所有记录的配置文件 [boolean]
      --to           检出项目直到（并包括）项目 <to..>，可以与选项 --profile/--add-profile
                     一起使用，以形成两个选项的并集选择。此处的项目选择器将
                     永远不会取代配置文件已检出的内容                   [array] [default: []]
      --from         检出项目从（包括其自身及其所有依赖项）项目 <from..> 下游开始，
                     可以与选项 --profile/--add-profile 一起使用，
                     以形成两个选项的并集选择。此处的项目选择器将
                     永远不会取代配置文件已检出的内容                   [array] [default: []]
```
