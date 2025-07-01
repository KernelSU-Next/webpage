import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'pt_BR',
  link: '/pt_BR/',
  description: "Uma solução root baseada em kernel para Android",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Início', link: '/pt_BR/' },
      { text: 'Instalação', link: '/pt_BR/pages/installation' },
      { text: 'Dispositivos', link: '/pt_BR/pages/devices' }
    ],

    sidebar: [
      {
        text: 'Guia',
        items: [
          { text: 'Instalação', link: '/pt_BR/pages/installation' },
          { text: 'Dispositivos', link: '/pt_BR/pages/devices' }
        ]
      }
    ],

    footer: {
        message: 'Lançado sob a licença GPL 2 e GPL 3.',
        copyright: '© 2025 KernelSU Next. Todos os direitos reservados.'
    },

    socialLinks: [
      { icon: 'github',  link: 'https://github.com/KernelSU-Next' },
      { icon: 'telegram', link: 'https://t.me/ksunext' }
    ]
  }
})
