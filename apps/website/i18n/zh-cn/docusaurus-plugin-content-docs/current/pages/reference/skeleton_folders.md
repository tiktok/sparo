---
title: 骨架文件夹
---

默认情况下，`sparo clone` 会初始化一个稀疏检出，不包含任何 Sparo 配置文件选择，但会包含包含基本配置文件的文件夹，如 **package-lock.yaml** 和 **package.json**。我们将这个起点称为检出的 **"骨架"**，因为它显示了 monorepo 中所有项目文件夹的完整树结构，但没有它们的源代码子文件夹。换句话说，尽管每个项目的源文件被排除在外，但骨架仍然允许工程师了解其他团队的项目，以及他们自己的项目与这些其他项目的关系。这有助于避免“隧道视野”（工程师假装他们的项目是仓库中唯一的项目），同时仍然确保 Git 的高效性能。

由于 Sparo 启用了 Git 稀疏检出的“锥形模式”优化，骨架使用 glob 模式来匹配整个文件夹，而不是单个文件。

## 骨架规范

包含的文件夹如下：

- 整个 `common/**` 文件夹，通常包括所有重要的配置文件和 Rush 操作的自动安装程序。
- 对于 **rush.json** 中定义的每个项目，顶级项目文件夹的内容。例如，**packages/my-app/package.json** 和 **packages/my-app/README.md** 将被包含，但 **packages/my-app/src/index.ts** 不会被包含。
- 顶级文件夹 `scripts/**` 和 `plugins/**`，因为这些名称通常用于其他重要项目。

当选择了一个 Sparo 配置文件（例如使用 `sparo checkout --profile my-team`）时，它将引入所选工作区项目下的所有源代码子文件夹。

## 嵌套项目的处理

在另一个工作区项目下嵌套一个工作区项目并不是最佳实践。例如，应避免以下文件夹组织方式：

- **packages/x/package.json**
- **packages/x/src/index.ts**
- **packages/x/y/package.json**  （项目 `y` 嵌套在项目 `x` 内——请避免这样做）
- **packages/x/y/src/index.ts**

然而，Sparo 可以正确支持这种场景。例如，如果您的配置文件选择了 `x` 而未选择 `y`，那么检出将包含 **x/src/index.ts**，但不包含 **x/y/src/index.ts**。
