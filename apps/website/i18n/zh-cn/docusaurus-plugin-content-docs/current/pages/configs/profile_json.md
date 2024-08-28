---
title: <profile-name>.json
---

要初始化一个新的 Sparo 配置文件，您可以复制并粘贴此模板的内容。

**common/sparo-profiles/&lt;profile-name&gt;.json**
```js
/**
 * 所有者:   <您的团队名称>
 * 目的:     <您使用此配置文件的目的>
 */
{
  "$schema": "https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json",

  /**
   * 一个 Rush 项目选择器列表，指示要包含在稀疏检出中的项目文件夹。
   * 选择器将组合以构成项目的并集。详情请参阅 Rush 选择器文档：
   * https://rushjs.io/pages/developer/selecting_subsets/
   */
  "selections": [
    /**
     * 例如，包含所有标记为 "tag:my-team" 的 Rush 项目
     * 以及构建它们所需的依赖工作区项目。
     * 要了解有关 Rush 项目标签的信息，请参阅此文档：
     * https://rushjs.io/pages/developer/project_tags/
     */
    // {
    //   "selector": "--to",
    //   "argument": "tag:my-team"
    // },
    /**
     * 例如，包含名为 "my-library" 的项目，以及所有
     * 受其更改影响的项目，以及构建所有项目所需的依赖项目。
     */
    // {
    //   "selector": "--from",
    //   "argument": "my-library"
    // }
  ],

  /**
   * 要包含在检出中的任意其他文件夹列表，
   * 不一定对应于任何工作区项目。
   * 路径应使用正斜杠，不带前导斜杠，并且应指向 monorepo 的根文件夹。
   * 出于性能原因，不支持通配符和 glob 模式。
   */
  "includeFolders": [
    // "path/to/include"
  ],

  /**
   * 要从检出中排除的文件夹列表。此字段优先于
   * "includeFolders" 和 "selections" 字段，确保指定的路径绝对不会被包含。
   * 路径应使用正斜杠，不带前导斜杠，并且应指向 monorepo 的根文件夹。
   * 出于性能原因，不支持通配符和 glob 模式。
   */
  "excludeFolders": [
    // "path/to/exclude"
  ]
}
```

## 另见

- [Sparo 配置文件](../guide/sparo_profiles.md)
