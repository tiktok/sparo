---
title: <profile-name>.json
---

To initialize a new Sparo profile, you can copy and paste the contents of this template.

**common/sparo-profiles/&lt;profile-name&gt;.json**
```js
{
  "$schema": "https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json",

  /**
   * A list of Rush project selectors indicating the project folders to be
   * included for sparse checkout.  The selectors will be combined to make
   * the union superset of projects.  See the Rush selector docs for details:
   * https://rushjs.io/pages/developer/selecting_subsets/
   */
  "selections": [
    /**
     * For example, include all Rush projects tagged with "tag:my-team"
     * as well as the dependency workspace projects needed to build them.
     */
    // {
    //   "selector": "--to",
    //   "argument": "tag:my-team"
    // },

    /**
     * For example, include the project called "my-library", as well as all
     * projects that are impacted by changes to it, as well as the dependency
     * projects needed to build everything.
     */
    // {
    //   "selector": "--from",
    //   "argument": "my-library"
    // }
  ],

  /**
   * A list of arbitrary additional folders to be included, not necessarily
   * corresponding to any workspace project.
   */
  "includeFolders": [
    // "path/to/include"
  ],
  
  /**
   * A list of folders to be excluded.  This field takes precedence over
   * the "includeFolders" and "selections" fields, guaranteeing that the
   * specified path will definitely not be included.
   */
  "excludeFolders": [
    // "path/to/exclude"
  ]
}
```

## See also

- [Sparo profiles](../guide/sparo_profiles.md)
