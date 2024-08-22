---
title: Sparo 配置文件
---

## 背景

Git 的稀疏签出功能通常依赖于存储在 `.git/info/sparse-checkout` 配置文件中的一组 glob 模式。Git 维护者发现常规的 glob 语法效率太低，因此他们引入了一种["锥形模式"](https://git-scm.com/docs/git-sparse-checkout#_internalsnon_cone_problems)的 glob 解释，这种模式忽略文件匹配模式，只匹配目录。

语法类似于以下内容：

**.git/info/sparse-checkout 示例**
```
/*
!/*/
/apps/
!/apps/*/
/apps/my-app/
!/apps/my-app/*/
/apps/my-app/_/
```

为了简化管理，Git 还提供了 `git sparse-checkout` 命令，用于简化从该文件中添加/删除模式的语法。然而，在一个包含数百个项目的大型 monorepo 中，管理这些 globs 仍然会令人困惑且容易出错。

## Sparo 改进了稀疏签出

Sparo 通过从称为 **配置文件** 的配置文件自动生成 `.git/info/sparse-checkout` 配置，使生活变得更简单。这带来了许多好处：

- Sparo 配置文件使用 [项目选择器](https://rushjs.io/pages/developer/selecting_subsets/#--to) 定义，例如：_"给我 **app1**、**app2**，以及所有构建它们所需的项目。"_ 这比指定 globs 更简洁且更易维护。

- 配置文件存储在配置文件中并提交到 Git。这使得与团队成员共享它们变得容易。

- 在分支切换时，配置文件会自动更新，确保确定性结果。例如，在签出一个非常旧的分支时，您希望获得旧的配置文件定义，而不是今天的版本。

- 您可以将多个配置文件组合在一起（`sparo checkout --profile team1 --profile team2`），选择它们项目的并集。这在修改一个被多个其他团队的项目使用的库项目时非常有用。当然，您可以使用 `--from the-library` 签出这些项目，但其他团队可能已经在他们的配置文件中包括了其他相关项目。

- Sparo 通过施加 `git sparse-checkout` 之外的额外限制来避免常见错误。这可以避免诸如尝试切换到缺少包含本地修改文件的项目文件夹的配置文件等错误。用户最好先暂存或提交此类修改。

## 配置文件的最佳实践

您可以向配置文件中添加 JSON 注释。在大型共享代码库中，我们建议在文件顶部添加一个标准化的标题，指示它们的所有权和用途。类似于以下内容：

**common/sparo-profiles/example-profile.json**
```js
/**
 * 所有者:   客户服务团队
 * 目的:     在处理客户服务应用程序时使用此配置文件。
 */
{
  "$schema": "https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json",

  /**
   * 一个 Rush 项目选择器列表，指示要包含在稀疏签出中的项目文件夹。
   * 选择器将组合以构成项目的并集。详情请参阅 Rush 选择器文档：
   * https://rushjs.io/pages/developer/selecting_subsets/
   */
  "selections": [
     {
        "selector": "--to",
        "argument": "tag:cs-dashboard"
     },
     {
        "selector": "--to",
        "argument": "tag:cs-tools"
     }
  ]
}
```

## 组合配置文件

组合配置文件的简单方法是多次指定 `--profile`。例如：

```sh
# 签出 team-a.json、team-b.json、team-c.json 配置文件的并集
# 注意: 这将替换已签出的任何配置文件选择。
sparo checkout --profile team-a --profile team-b --profile team-c
```

您还可以使用 `--add-profile` 来逐步组合它们。例如：

```shell
# 这三个命令等同于上述命令。
sparo checkout --profile team-a
sparo checkout --add-profile team-b
sparo checkout --add-profile team-c
```

如何完全不签出任何配置文件？也就是说，如何返回到仅包含[骨架](../reference/skeleton_folders.md)文件夹的干净 `sparo clone` 的初始状态？答案是使用 `--no-profile` 参数：

```shell
# 尚未实现 - 仅签出骨架文件夹
# 而不应用任何配置文件
sparo checkout --no-profile
```

如果 `sparo checkout` 不带 `--profile` 或 `--add-profile` 或 `--no-profile`，则保留现有的配置文件选择。换句话说，您的配置文件选择通常在命令之间是“粘性的”。

## 查询配置文件

用户可以通过调用 [sparo list-profiles](../commands/sparo_list-profiles.md) 命令发现当前分支中的可用配置文件。`--project` 参数使您可以查询给定项目的相关配置文件。例如：

```shell
# 假设您需要为 "example-app" 项目进行修复。

# 哪些稀疏签出配置文件包含 "example-app" 项目？
sparo list-profiles --project example-app

# 很好，让我们将 "example-profile" 结果添加到我们当前的签出中
# （与现有配置文件组合）。
sparo checkout --add-profile example-profile
```

## 另见

- [&lt;profile-name&gt;.json](../configs/profile_json.md) 配置文件
