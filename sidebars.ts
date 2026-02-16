import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'quick-start',
    'getting-started',

    'design-principles',
    'best-practices',
    'real-world-examples',

    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'core/entries',
        'core/actions',
        'core/metadata',
        'core/context',
        'core/transactions',
        'core/correlation',
      ],
    },

    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/logging',
        'guides/querying',
        'guides/exporting',
        'guides/metadata-resolvers',
        'guides/context-middleware',
      ],
    },

    'advanced/architecture',
    'advanced/extending',

    'upgrade-guide',
    'faq',
  ],
};

export default sidebars;
