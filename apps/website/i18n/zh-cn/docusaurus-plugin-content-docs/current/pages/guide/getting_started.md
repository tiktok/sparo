---
title: 入门指南
---

在本教程中，我们将重温[快速演示](../../index.md#quick-demo)的步骤，但这次我们将更详细地探讨 Sparo 的工作流程。

## 第 1 步：升级 Git

请记住将 Git 升级到最新版本！许多 Git 优化功能相对较新，在旧版本的软件中不可用。

对于 macOS，我们推荐使用 [brew install git](https://git-scm.com/download/mac)。对于其他操作系统，请参阅 [Git 文档](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) 了解安装说明。

## 第 2 步：克隆您的 Rush monorepo

克隆您的 [RushJS](https://rushjs.io/) monorepo：

```shell
sparo clone https://github.com/my-company/my-monorepo.git

cd my-monorepo
```

👉 _对于真实世界的演示，尝试克隆这个仓库：_
[https://github.com/Azure/azure-sdk-for-js.git](https://github.com/Azure/azure-sdk-for-js.git)


**"sparo clone" 的优化方式：**

- 仅获取默认分支（通常是 `main` 分支）。这显著减少了下载大小。

- 启用了 Git 无 Blob 的[部分克隆](../reference/git_optimization.md)以延迟下载文件内容。

- 使用 Git [稀疏签出](https://git-scm.com/docs/git-sparse-checkout) 仅克隆["骨架"文件夹](../reference/skeleton_folders.md)，其中包括所有工作区的 **package.json** 文件，但不包括源代码子文件夹。

- 稀疏签出已配置为更高效的["锥形模式"](https://git-scm.com/docs/git-sparse-checkout#_internalsnon_cone_problems)。

**提示:** 如果想查看执行的操作和 Git 操作，使用 `sparo --debug clone` 代替 `sparo clone`。

> 💡 目前支持 PNPM 和 Yarn 工作区的功能计划中，但尚未实现。欢迎贡献！

## 第 3 步：创建稀疏配置文件

定义一个 [Sparo 配置文件](../configs/profile_json.md)，描述 Git 稀疏签出的仓库文件夹子集。

```shell
# 将模板写入 common/sparo-profiles/my-team.json
sparo init-profile --profile my-team
```

编辑创建的 **my-team.json** 文件并添加一个选择器。例如：

**common/sparo-profiles/my-team.json**
```json
{
  "selections": [
    {
      "selector": "--to",
      "argument": "my-rush-project"
    }
  ]
}
```
👉 _如果您正在演示 **azure-sdk-for-js**，请将 `my-rush-project` 替换为 `@azure/arm-commerce`。_

在上面的例子中，`--to` [项目选择器](https://rushjs.io/pages/developer/selecting_subsets/#--to) 指示 Sparo 签出工作区中构建 `my-rush-project` 所需的所有依赖项。

```shell
# 将您的配置文件提交到 Git。（此步骤在快速演示中已跳过。）
# Sparo 配置文件通常应存储在 Git 中，因为这可以使您在分支之间移动时无需担心
# 某个分支中存在哪些项目。
sparo add .
sparo commit -m "Created a new Sparo profile"
```

## 第 4 步：签出您的 Sparo 配置文件

`--profile` 参数可以与 `sparo checkout` 一起使用（未来也可以与 `sparo clone` 和 `sparo pull` 一起使用）。此参数指定要选择的 JSON 文件的名称。您还可以组合多个配置文件（`sparo checkout --profile p1 --profile p2`），在这种情况下，将使用它们选择的集合的并集。组合配置文件是一个高级场景，但在例如您的拉取请求将影响属于多个团队的项目集时非常有用。

**基于 common/sparo-profiles/my-team.json 的稀疏签出**
```shell
sparo checkout --profile my-team
```

**关于 "sparo checkout" 的更多信息：**

- Sparo 根据您的配置文件选择自动生成 Git 的 `$GIT_DIR/info/sparse-checkout` [配置文件](https://git-scm.com/docs/git-sparse-checkout#_internalssparse_checkout)。为避免冲突，请不要直接编辑此文件或使用其他工具（如 `git sparse-checkout`）重写它。（这样做不会破坏任何东西，但可能会干扰 Sparo 的操作。）

- 要仅签出骨架（返回到第 1 步尚未选择任何配置文件的初始状态），请指定 `--no-profile` 代替 `--profile NAME`。

- 要添加更多配置文件，并与现有选择组合，请使用 `--add-profile NAME` 代替 `--profile NAME`。例如，以下两个命令与 `sparo checkout --profile p1 --profile p2` 产生相同的结果：
  ```shell
  sparo checkout --profile p1
  sparo checkout --add-profile p2
  ```

## 第 5 步：使用镜像子命令

在日常工作中，考虑选择 [镜像子命令](../commands/overview.md)，例如 `sparo revert` 而不是 `git revert`。Sparo 包装器提供 (1) 更好的默认设置，(2) 更好的性能建议，以及 (3) 可选的匿名化性能指标。

示例：

```shell
sparo pull

sparo commit -m "Example command"
```
