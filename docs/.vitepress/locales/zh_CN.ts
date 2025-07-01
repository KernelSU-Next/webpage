import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh_CN',
  link: '/zh_CN/',
  description: "新一代安卓内核级 Root 方案",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/zh_CN/' },
      { text: '安装', link: '/zh_CN/pages/installation' },
      { text: '设备', link: '/zh_CN/pages/devices' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: '安装', link: '/zh_CN/pages/installation' },
          { text: '设备', link: '/zh_CN/pages/devices' }
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
