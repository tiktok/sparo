---
title: Contributing
---

Building the projects in this monorepo:

1. Install the [RushJS](https://rushjs.io/) tool:

   ```shell
   npm install -g @microsoft/rush
   ```

2. Clone the repo:

   ```shell
   git clone https://github.com/tiktok/sparo.git
   ```

3. Install the dependencies

   ```shell
   cd sparo
   rush install
   ```

4. Build all projects

   ```shell
   rush build
   ```

How to invoke your locally build `sparo` command:

```shell
cd apps/sparo
node lib/start.js
```
