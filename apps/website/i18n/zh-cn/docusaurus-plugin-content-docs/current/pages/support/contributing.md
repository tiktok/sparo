---
title: 贡献指南
---

在这个 monorepo 中构建项目：

1. 安装 [RushJS](https://rushjs.io/) 工具：

   ```shell
   npm install -g @microsoft/rush
   ```

2. 克隆仓库：

   ```shell
   git clone https://github.com/tiktok/sparo.git
   ```

3. 安装依赖项

   ```shell
   cd sparo
   rush install
   ```

4. 构建所有项目

   ```shell
   rush build
   ```

如何调用您本地构建的 `sparo` 命令：

```shell
cd apps/sparo
node lib/start.js
```
