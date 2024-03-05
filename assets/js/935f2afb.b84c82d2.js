"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[581],{5610:e=>{e.exports=JSON.parse('{"pluginId":"default","version":"current","label":"Next","banner":null,"badge":false,"noIndex":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"docsSidebar":[{"type":"category","label":"Introduction","collapsible":false,"items":[{"type":"link","label":"Overview","href":"/sparo/","docId":"index","unlisted":false},{"type":"link","label":"Getting Started","href":"/sparo/pages/guide/getting_started","docId":"pages/guide/getting_started","unlisted":false},{"type":"link","label":"Sparo profiles","href":"/sparo/pages/guide/sparo_profiles","docId":"pages/guide/sparo_profiles","unlisted":false}],"collapsed":false},{"type":"category","label":"Reference","collapsible":false,"items":[{"type":"link","label":"Git optimization","href":"/sparo/pages/reference/git_optimization","docId":"pages/reference/git_optimization","unlisted":false},{"type":"link","label":"Skeleton folders","href":"/sparo/pages/reference/skeleton_folders","docId":"pages/reference/skeleton_folders","unlisted":false},{"type":"link","label":"Security","href":"/sparo/pages/reference/security","docId":"pages/reference/security","unlisted":false}],"collapsed":false},{"type":"category","label":"Config files","collapsible":false,"items":[{"type":"link","label":"<profile-name>.json","href":"/sparo/pages/configs/profile_json","docId":"pages/configs/profile_json","unlisted":false}],"collapsed":false},{"type":"category","label":"Commands","collapsible":false,"items":[{"type":"link","label":"Overview","href":"/sparo/pages/commands/overview","docId":"pages/commands/overview","unlisted":false},{"type":"link","label":"sparo auto-config","href":"/sparo/pages/commands/sparo_auto-config","docId":"pages/commands/sparo_auto-config","unlisted":false},{"type":"link","label":"sparo checkout","href":"/sparo/pages/commands/sparo_checkout","docId":"pages/commands/sparo_checkout","unlisted":false},{"type":"link","label":"sparo clone","href":"/sparo/pages/commands/sparo_clone","docId":"pages/commands/sparo_clone","unlisted":false},{"type":"link","label":"sparo fetch","href":"/sparo/pages/commands/sparo_fetch","docId":"pages/commands/sparo_fetch","unlisted":false},{"type":"link","label":"sparo git-checkout","href":"/sparo/pages/commands/sparo_git-checkout","docId":"pages/commands/sparo_git-checkout","unlisted":false},{"type":"link","label":"sparo git-clone","href":"/sparo/pages/commands/sparo_git-clone","docId":"pages/commands/sparo_git-clone","unlisted":false},{"type":"link","label":"sparo git-fetch","href":"/sparo/pages/commands/sparo_git-fetch","docId":"pages/commands/sparo_git-fetch","unlisted":false},{"type":"link","label":"sparo init-profile","href":"/sparo/pages/commands/sparo_init-profile","docId":"pages/commands/sparo_init-profile","unlisted":false},{"type":"link","label":"sparo list-profiles","href":"/sparo/pages/commands/sparo_list-profiles","docId":"pages/commands/sparo_list-profiles","unlisted":false}],"collapsed":false},{"type":"category","label":"CI Commands","collapsible":false,"items":[{"type":"link","label":"Overview","href":"/sparo/pages/ci_commands/overview","docId":"pages/ci_commands/overview","unlisted":false},{"type":"link","label":"sparo-ci checkout","href":"/sparo/pages/ci_commands/sparo-ci_checkout","docId":"pages/ci_commands/sparo-ci_checkout","unlisted":false},{"type":"link","label":"sparo-ci clone","href":"/sparo/pages/ci_commands/sparo-ci_clone","docId":"pages/ci_commands/sparo-ci_clone","unlisted":false}],"collapsed":false},{"type":"category","label":"Support","collapsible":false,"items":[{"type":"link","label":"Getting help","href":"/sparo/pages/support/help","docId":"pages/support/help","unlisted":false},{"type":"link","label":"What\'s new","href":"/sparo/pages/support/news","docId":"pages/support/news","unlisted":false},{"type":"link","label":"Contributing","href":"/sparo/pages/support/contributing","docId":"pages/support/contributing","unlisted":false}],"collapsed":false}]},"docs":{"index":{"id":"index","title":"Overview","description":"<ThemedImage","sidebar":"docsSidebar"},"pages/ci_commands/overview":{"id":"pages/ci_commands/overview","title":"Overview","description":"Everyday development involves a variety of Git operations such as switching between branches, fetching incremental changes from the server, and browsing history.  By contrast, when a continuous integration (CI) pipeline checks out a Git branch, it is typically a much simpler operation. The folder or entire virtual machine image may be discarded as soon as the job completes.  Therefore, different approaches for optimizing Git require required for these two use cases.","sidebar":"docsSidebar"},"pages/ci_commands/sparo-ci_checkout":{"id":"pages/ci_commands/sparo-ci_checkout","title":"sparo-ci checkout","description":"","sidebar":"docsSidebar"},"pages/ci_commands/sparo-ci_clone":{"id":"pages/ci_commands/sparo-ci_clone","title":"sparo-ci clone","description":"","sidebar":"docsSidebar"},"pages/commands/overview":{"id":"pages/commands/overview","title":"Overview","description":"The git command-line tool supports various subcommands such as git clone, git checkout, and so forth.  The sparo command-line is intended to be a complete replacement for git.","sidebar":"docsSidebar"},"pages/commands/sparo_auto-config":{"id":"pages/commands/sparo_auto-config","title":"sparo auto-config","description":"You do not normally need to invoke sparo auto-config.  As the name implies, it is automatically applied by sparo clone.  This command is provided for reapplying the configuration in a situation where the user may have manually altered Sparo\'s configuration.  It is a good first step when investigating problems.","sidebar":"docsSidebar"},"pages/commands/sparo_checkout":{"id":"pages/commands/sparo_checkout","title":"sparo checkout","description":"","sidebar":"docsSidebar"},"pages/commands/sparo_clone":{"id":"pages/commands/sparo_clone","title":"sparo clone","description":"","sidebar":"docsSidebar"},"pages/commands/sparo_fetch":{"id":"pages/commands/sparo_fetch","title":"sparo fetch","description":"","sidebar":"docsSidebar"},"pages/commands/sparo_git-checkout":{"id":"pages/commands/sparo_git-checkout","title":"sparo git-checkout","description":"This is the mirrored subcommand for git checkout.  It has the same functionality as the corresponding Git subcommand, but supports Sparo\'s optional anonymous timing metrics collection.","sidebar":"docsSidebar"},"pages/commands/sparo_git-clone":{"id":"pages/commands/sparo_git-clone","title":"sparo git-clone","description":"This is the mirrored subcommand for git clone.  It has the same functionality as the corresponding Git subcommand, but supports Sparo\'s optional anonymous timing metrics collection.","sidebar":"docsSidebar"},"pages/commands/sparo_git-fetch":{"id":"pages/commands/sparo_git-fetch","title":"sparo git-fetch","description":"This is the mirrored subcommand for git fetch.  It has the same functionality as the corresponding Git subcommand, but supports Sparo\'s optional anonymous timing metrics collection.","sidebar":"docsSidebar"},"pages/commands/sparo_init-profile":{"id":"pages/commands/sparo_init-profile","title":"sparo init-profile","description":"","sidebar":"docsSidebar"},"pages/commands/sparo_list-profiles":{"id":"pages/commands/sparo_list-profiles","title":"sparo list-profiles","description":"","sidebar":"docsSidebar"},"pages/configs/profile_json":{"id":"pages/configs/profile_json","title":"<profile-name>.json","description":"To initialize a new Sparo profile, you can copy and paste the contents of this template.","sidebar":"docsSidebar"},"pages/guide/getting_started":{"id":"pages/guide/getting_started","title":"Getting Started","description":"Everyday workflow","sidebar":"docsSidebar"},"pages/guide/sparo_profiles":{"id":"pages/guide/sparo_profiles","title":"Sparo profiles","description":"Git\'s sparse checkout feature normally relies on a collection of glob patterns that are stored in the .git/info/sparse-checkout config file.  Normal glob syntax proved to be too inefficient, so Git instead uses a \\"cone mode\\" glob interpretation that ignores file-matching patterns and only matches directories.","sidebar":"docsSidebar"},"pages/reference/git_optimization":{"id":"pages/reference/git_optimization","title":"Git optimization","description":"By default git clone will download every file in your Git repository, as well as the complete history of every file. For small repositories, that\'s no big deal. But as your monorepo accumulates projects and years of history, Git operations become slower and slower, until one day git status is taking 10 seconds or more. What to do?","sidebar":"docsSidebar"},"pages/reference/security":{"id":"pages/reference/security","title":"Security","description":"Because the Sparo tool acts as a wrapper for Git, our goal is to provide comparable security expectations as the git command.","sidebar":"docsSidebar"},"pages/reference/skeleton_folders":{"id":"pages/reference/skeleton_folders","title":"Skeleton folders","description":"By default sparo clones initializes a sparse checkout that does not include any Sparo profile selections, but does include folders containing essential config files such as package-lock.yaml and package.json.  We call this starting point the checkout \\"skeleton\\" because it shows the full tree of all project folders in your monorepo, but without their source code subfolders.  In other words, although the source files for each project are excluded, the skeleton nonetheless allows engineers to remain aware of other team\'s projects, and how their own project relates to those other projects.  This discourages \\"tunnel vision\\" (where engineers pretend their project is the only project in the repository), while still ensuring fast Git performance.","sidebar":"docsSidebar"},"pages/support/contributing":{"id":"pages/support/contributing","title":"Contributing","description":"Building the projects in this monorepo:","sidebar":"docsSidebar"},"pages/support/help":{"id":"pages/support/help","title":"Getting help","description":"Please create a GitHub issue to report any problems or feature requests.","sidebar":"docsSidebar"},"pages/support/news":{"id":"pages/support/news","title":"What\'s new","description":"To find out what\'s changed in the latest release, please consult the CHANGELOG.md notes.","sidebar":"docsSidebar"}}}')}}]);