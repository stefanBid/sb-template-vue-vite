import { fileURLToPath, URL } from 'node:url'

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    // Tailwind CSS v4 — https://tailwindcss.com/docs/installation/using-vite
    tailwindcss(),

    // Icons as Vue components, compiled at build time from the local @iconify-json/* collections
    // https://github.com/unplugin/unplugin-icons
    Icons({
      compiler: 'vue3',
      scale: 1,
    }),

    // Locale messages precompiled at build time, so the runtime ships without the message compiler
    // https://vue-i18n.intlify.dev/guide/advanced/optimization
    VueI18nPlugin({
      include: [fileURLToPath(new URL('./src/i18n/locales/**', import.meta.url))],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: false,
  },
})
