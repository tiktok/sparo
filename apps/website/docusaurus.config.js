// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sparo',
  tagline: 'Faster Git for large frontend monorepos',
  favicon: 'images/site/sparo-favicon.ico',

  // Set the production url of your site here
  url: 'https://tiktok.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/sparo/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tiktok', // Usually your GitHub org/user name.
  projectName: 'sparo', // Usually your repo name.
  trailingSlash: true,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn']
  },

  plugins: [
    [
      require.resolve('docusaurus-lunr-search'),
      {
        // language codes
        languages: ['en', 'zh']
      }
    ]
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          breadcrumbs: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/tiktok/sparo/tree/main/apps/website/'
        },
        /*
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/'
        },
        */
        theme: {
          customCss: './src/css/custom.css'
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'images/site/sparo-ograph.png',
      navbar: {
        title: '',
        logo: {
          alt: 'Sparo',
          src: 'images/site/sparo-title.svg',
          srcDark: 'images/site/sparo-title-dark.svg'
        },
        items: [
          {
            type: 'localeDropdown',
            position: 'left'
          },
          {
            to: 'pages/guide/getting_started',
            position: 'right',
            label: 'Docs'
          },
          {
            href: 'https://github.com/tiktok/sparo',
            label: 'GitHub',
            position: 'right'
          },
          {
            to: 'pages/support/news',
            position: 'right',
            label: 'News'
          },
          {
            to: 'pages/support/help',
            position: 'right',
            label: 'Help'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} TikTok Pte. Ltd.`
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        // Docusaurus's small set of Markdown syntax highlighting languages:
        // https://docusaurus.io/docs/markdown-features/code-blocks#supported-languages
        additionalLanguages: ['bash', 'batch', 'javascript', 'json', 'powershell', 'typescript']
      }
    })
};

export default config;
