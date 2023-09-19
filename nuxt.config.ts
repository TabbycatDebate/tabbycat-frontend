// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    // '@nuxtjs/i18n',
    'nuxt-route-meta',
    '@nuxtjs/eslint-module',
    'floating-vue/nuxt',
  ],
  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },
});
