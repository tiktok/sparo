# Sparo

<div>
  <br />
  <a href="https://tiktok.github.io/sparo/">
    <img width="380" src="https://tiktok.github.io/sparo/images/site/sparo-logo.svg" alt="Sparo" />
  </a>
  <p />
</div>

## Is Git too slow in your frontend monorepo?

By default `git clone` will download every file in your Git repository, as well as the complete history of every file. For small repositories, that's no big deal. But as your monorepo accumulates projects and years of history, Git operations become slower and slower, until one day `git status` is taking 10 seconds or more. What to do?

<!-- Text below this line should stay in sync with the website index.md -->
<!-- ------------------------------------------------------------------ -->

## Clone faster!

Sparo optimizes performance of Git operations for your large frontend monorepo.

## Key features

- **Familiar interface:** The `sparo` command-line interface (CLI) wrapper offers **better defaults** and **performance suggestions** without altering the familiar `git` syntax. (The native `git` CLI is also supported.)
- **A proven solution:** Git provides [quite a lot of ingredients](https://tiktok.github.io/sparo/pages/reference/git_optimization/) for optimizing very large repos; Sparo is your recipe for combining these features intelligently.
- **Simplified sparse checkout:** Work with sparse checkout [profiles](https://tiktok.github.io/sparo/pages/guide/sparo_profiles/) instead of confusing "cones" and globs
- **Frontend integration:** Sparo leverages [Rush](https://rushjs.io/) and [PNPM](https://pnpm.io/) workspace configurations, including the ability to automatically checkout project dependencies
- **Dual workflows:** The `sparo-ci` tool implements a specialized checkout model optimized for continuous integration (CI) pipelines
- **Extra safeguards**: Avoid common Git mistakes such as checkouts with staged files outside the active view
- **Go beyond Git hooks:** Optionally collect anonymized Git timing metrics in your monorepo, enabling your build team to set data-driven goals for _local_ developer experience (not just CI!)

  _(Metrics are transmitted to your own service and are not accessible by any other party.)_

<!-- ------------------------------------------------------------------ -->
<!-- Text above this line should stay in sync with the website index.md -->

## Links

- [Quick demo](https://tiktok.github.io/sparo/#quick-demo): See for yourself in 3 minutes!
- [Getting Started](https://tiktok.github.io/sparo/pages/guide/getting_started/): Step by step instructions
- [CHANGELOG.md](
  https://github.com/tiktok/sparo/blob/main/apps/sparo/CHANGELOG.md): Find
  out what's new in the latest version
