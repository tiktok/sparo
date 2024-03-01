/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  //tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }]

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */

  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      collapsible: false,
      items: ['index', 'pages/guide/getting_started', 'pages/guide/sparo_profiles']
    },
    {
      type: 'category',
      label: 'Reference',
      collapsible: false,
      items: [
        'pages/reference/git_optimization',
        'pages/reference/skeleton_folders',
        'pages/reference/security'
      ]
    },
    {
      type: 'category',
      label: 'Config files',
      collapsible: false,
      items: ['pages/configs/profile_json']
    },
    {
      type: 'category',
      label: 'Commands',
      collapsible: false,
      items: [
        'pages/commands/overview',
        'pages/commands/sparo_auto-config',
        'pages/commands/sparo_checkout',
        'pages/commands/sparo_clone',
        'pages/commands/sparo_fetch',
        'pages/commands/sparo_git-checkout',
        'pages/commands/sparo_git-clone',
        'pages/commands/sparo_git-fetch',
        'pages/commands/sparo_init-profile',
        'pages/commands/sparo_list-profiles'
      ]
    },
    {
      type: 'category',
      label: 'CI Commands',
      collapsible: false,
      items: [
        'pages/ci_commands/overview',
        'pages/ci_commands/sparo-ci_checkout',
        'pages/ci_commands/sparo-ci_clone'
      ]
    },
    {
      type: 'category',
      label: 'Support',
      collapsible: false,
      items: ['pages/support/help', 'pages/support/news', 'pages/support/contributing']
    }
  ]
};

export default sidebars;
