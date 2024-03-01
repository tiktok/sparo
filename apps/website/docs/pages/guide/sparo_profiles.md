---
title: Sparo profiles
---

Git's sparse checkout feature normally relies on a collection of glob patterns that are stored in the `.git/info/sparse-checkout` config file.  Normal glob syntax proved to be too inefficient, so Git instead uses ["cone mode"](https://git-scm.com/docs/git-sparse-checkout#_internalsnon_cone_problems) that ignores file-matching patterns and only matches directories.

The syntax looks something like this:

**.git/info/sparse-checkout  example**
```
/*
!/*/
/apps/
!/apps/*/
/apps/my-app/
!/apps/my-app/*/
/apps/my-app/_/
```

To simplify management, the `git sparse-checkout` command line provides convenient ways to add/remove patterns from this file.  However, in a large monorepo with hundreds of projects, managing these globs can be confusing and error-prone.

Sparo's approach is to generate the `.git/info/sparse-checkout` configuration from config files called profiles.  This provides many benefits:

- Profiles are specified using [project selectors](https://rushjs.io/pages/developer/selecting_subsets/#--to), for example: _"Give me **app1**, **app2**, and all the projects needed to build them."_ This is more concise and maintainable than specifying globs.

- Profiles are stored in a config file and committed to Git.  This makes it easy to share them with your teammates.

- Profiles are automatically updated when switching between branches, which ensures deterministic results.  For example, when checking out a very old branch, you want the old profile definition, not today's version of it.

- You combine multiple profiles at the same time (`sparo checkout --profile team1 --profile team2`), which produces the union of their subsets.  This is useful for example when modifying a library project that is consumed by projects belonging to several other teams.  You could instead use a selector `--from the-library` of course, but it's likely those other teams have included other relevant projects in their profiles.

- Sparo avoids common mistakes by imposing additional restrictions beyond `git sparse-checkout`.

## Best practices for profiles

You an add JSON comments to your profile config files.  In a large shared codebase, we recommend adding a standardized header to the top of your files indicating their ownership and purpose.  Something like this:

**common/sparo-profiles/example-profile.json**
```js
/**
 * OWNER:   Customer service team
 * PURPOSE: Use this profile when working on the customer service apps.
 */
{
  "$schema": "https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json",

  /**
   * A list of Rush project selectors indicating the project folders to be
   * included for sparse checkout.  The selectors will be combined to make
   * the union superset of projects.  See the Rush selector docs for details:
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

## Combining profiles

The simple way to combine profiles is to specify `--profile` multiple times.  For example:

```shell
# Check out the union of profiles team-a.json, team-b.json, team-c.json
# NOTE: This will replace whatever profile selection was already checked out.
sparo checkout --profile team-a --profile team-b --profile team-c
```

You can also use `--add-profile` to incrementally combine them.  For example:

```shell
# These three commands are equivalent to the above command.
sparo checkout --profile team-a
sparo checkout --add-profile team-b
sparo checkout --add-profile team-c
```

How to checkout NO profile? In other words, returning to the [skeleton](../reference/skeleton_folders.md) state of a clean `sparo clone`?  It can't be `sparo checkout`, because if `--profile` is entirely omitted then the existing profile selection is preserved.

```shell
# NOT IMPLEMENTED YET - check out just the skeleton folders
# without applying any profiles
sparo checkout --no-profile
```


## Querying profiles

Engineers can find available profiles in the current branch by invoking the [sparo list-profiles](../commands/sparo_list-profiles) command.  The `--project` parameter enables you to query relevant profiles for a given project.  For example:

```shell
# Suppose you need to make a fix for the "example-app" project.

# Which sparse checkout profiles include the "example-app" project?
sparo list-profiles --project example-app

# Great, let's add the "example-profile" result to our current checkout
# (combining it with the existing profile).
sparo checkout --add-profile example-profile
```
