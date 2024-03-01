---
title: Contributing
---

Building the projects in this monorepo:

1. Install the [RushJS](https://rushjs.io/) tool:

   ```bash
   npm install -g @microsoft/rush
   ```

2. Clone the repo:

   ```bash
   git clone https://github.com/tiktok/sparo.git
   ```

3. Install the dependencies

   ```bash
   cd sparo
   rush install
   ```

4. Build all projects

   ```bash
   rush build
   ```

How to invoke your locally build `sparo` command:

```bash
cd apps/sparo
node lib/start.js
```
