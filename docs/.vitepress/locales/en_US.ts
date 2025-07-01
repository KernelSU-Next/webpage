import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en_US',
  description: "A kernel-based root solution for Android",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Installation', link: '/pages/installation' },
      { text: 'Devices', link: '/pages/devices' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Installation', link: '/pages/installation' },
          { text: 'Devices', link: '/pages/devices' }
        ]
      }
    ],

    footer: {
        message: 'Released under the GPL 2 and GPL 3 license.',
        copyright: '© 2025 KernelSU Next. All rights reserved.'
    },

    socialLinks: [
      { icon: 'github',  link: 'https://github.com/KernelSU-Next' },
      { icon: 'telegram', link: 'https://t.me/ksunext' }
    ]
  }
})
