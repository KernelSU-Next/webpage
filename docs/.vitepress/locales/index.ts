import { defineConfig } from 'vitepress'
import en_US from './en_US'
import pt_BR from './pt_BR'
import zh_CN from './zh_CN'

export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: en_US.lang,
      themeConfig: en_US.themeConfig,
      description: en_US.description
    },
    pt_BR: {
      label: 'Português (Brasil)',
      link: pt_BR.link,
      lang: pt_BR.lang,
      themeConfig: pt_BR.themeConfig,
      description: pt_BR.description
    },
    zh_CN: {
      label: '简体中文',
      link: zh_CN.link,
      lang: zh_CN.lang,
      themeConfig: zh_CN.themeConfig,
      description: zh_CN.description
    }
  }
})
