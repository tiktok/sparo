---
title: 安全性
---

由于 Sparo 工具作为 Git 的包装器，我们的目标是提供与 `git` 命令相当的安全性预期。

> ⚠️ **这是一个目标，而不是保证。** ⚠️
>
> 该软件仍处于开发的早期阶段，并非所有的安全需求都已被识别或实现。任何改进 Sparo 安全性的努力都不应被解释为与 MIT 许可证的条款相矛盾：
>
> ```
> 该软件按“原样”提供，不附带任何形式的明示或暗示担保，
> 包括但不限于适销性、特定用途适用性和非侵权的担保。
> 在任何情况下，作者或版权持有者都不对因软件或软件的使用或其他交易
> 引起的任何索赔、损害或其他责任负责，无论是在合同诉讼、侵权行为或其他情况下。
> ```

## 安全场景

Git 没有提供正式的安全规范，因此为了便于分析 Sparo 贡献，我们确定了一些暗示安全需求的使用场景。我们欢迎您的反馈——如果我们忽略了重要的用例，或者 Git 的行为与描述不符，请[告知我们](../support/contributing.md)。

### SS1: 安全地克隆不受信任的仓库

假设一个不熟悉的远程 Git 仓库包含恶意文件，其中包括恶意配置文件，如 `.gitattributes`、`.gitignore` 和 Git 钩子脚本。以下操作应被认为是安全的：

- 使用 `git clone` 克隆远程仓库。
- 使用 `git checkout` 检出文件。
- 使用 `git commit` 提交本地文件的修改。

Git 通过默认忽略 Git 钩子和 `.gitattributes` 过滤器来确保安全。用户必须显式运行命令以“选择加入”，表示他们相信该仓库没有恶意代码。例如，调用 `rush install` 将注册预定义的 Git 钩子，因为 NPM 安装涉及执行不受信任的脚本，因此表示信任克隆的仓库。另一个例子是，如果 `.gitattributes` 引用了 LFS 过滤器，用户必须先通过运行 `git lfs install` 选择加入，这表明他们相信过滤器的作者已实施安全保护措施以防止恶意输入。

Sparo 引入了额外的配置文件，例如 [&lt;profile-name&gt;.json](../configs/profile_json.md)。这些配置文件的解析也必须将输入视为潜在的恶意，并提供相同的安全保证。

### SS2: 安全地克隆不受信任的仓库参数

诸如 `git clone https://github.com/example/project.git` 之类的命令会写入一个名为 `project` 的子文件夹。Git 文档将此称为 URL 的["humanish"](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt-ltdirectorygt)部分。

考虑一个接收 `REPOSITORY` 参数作为文本字符串并随后正确进行 shell 转义后调用 `git clone REPOSITORY` 的远程服务。在计算 humanish 文件夹名称时，Git 不应包含诸如 `..` 或 `/` 之类的特殊字符，这些字符会导致操作将克隆的文件写入预期文件夹之外。

当然，如果使用 `git clone https://github.com/example/project.git my-folder` 指定了显式目标文件夹，则不应将任何文件克隆到 `my-folder` 文件夹之外。

### SS3: Git 参数可能包含特殊字符

Shell 解释器通常会转换涉及特殊字符的表达式，例如 `$`、`%`、`(` 等。例如：

```shell
# 问题：Bash 会将 "$project" 替换为
# 名为 "project" 的环境变量的值。
git clone https://github.com/example/project.git $project
```

这需要进行转义：

```shell
# 这个反斜杠转义确保在创建的文件夹名称中包含一个字面上的美元符号：
git clone https://github.com/example/project.git \$project
```

当 `sparo` 命令行调用子进程（如 `git`）时，它必须仔细确保进程参数被正确转义，以避免被 shell 转换。例如，如果 `\$project` 在子进程调用期间被 shell 扩展，转义将失效，这可能被利用来规避 Sparo 的其他安全保证。如果某些字符[无法通过 Node.js 安全转义](https://github.com/microsoft/rushstack/blob/e2a17c81731cadc6b39b8e75c08dfccb9bc5ce9c/libraries/node-core-library/src/Executable.ts#L689)，则应通过错误消息将其拒绝。


## 安全假设

同时指出一些不期望是安全的方面也很有用。

## 假设：Shell 环境变量是受信任的

在大多数情况下，`git` CLI 假设 shell 环境变量是受信任的。例如，它依赖 `PATH` 变量来发现 `ssh` 二进制文件的位置，并且大多数父进程的变量会传递给子进程。

由于 Sparo 工具是由 Node.js 运行时调用的，通过环境变量（如 [NODE_OPTIONS](https://nodejs.org/api/cli.html#node_optionsoptions)）执行任意代码是可能的。

## 假设：命令行通常是受信任的

`git` 命令行接受诸如 [-c](https://git-scm.com/docs/git#Documentation/git.txt--cltnamegtltvaluegt) 之类的参数，这些参数可以触发任意代码的执行。因此，通常情况下，我们假设命令行参数是受信任的。然而，某些参数可以提供更严格的保证，例如 **SS3** 中提到的 `git clone` 的 `<repository>` 参数。

## 假设：命令可能会消耗过多资源

诸如 `git clone` 之类的命令可能会消耗任意数量的磁盘空间或需要任意长的时间才能完成。一般来说，拒绝服务攻击对于这种开发工具来说不被认为是重要的风险。

## 假设：STDOUT 和 STDERR 可能包含任意字符

在调用 `git` CLI 时，控制台输出可能包含由钩子脚本或其他 shell 命令打印的字符串。这些字符串可能包含不安全的特殊字符，不适合嵌入到其他上下文中，如 HTML 文档或 SQL 字符串文字中。调用进程有责任正确转义 `git` 或 `sparo` 进程产生的任何 STDOUT 或 STDERR 输出。
