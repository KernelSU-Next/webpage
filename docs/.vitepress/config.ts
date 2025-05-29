import { defineConfig} from 'vitepress'
import locales from './locales'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "KernelSU Next",
  locales: locales.locales,
  base: '/webpage/'
})
