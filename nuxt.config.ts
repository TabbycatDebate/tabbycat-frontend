import DialogStyle from 'primevue/dialog/style';

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
    'nuxt-primevue',
  ],
  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },
  primevue: {
    options: {
      unstyled: true,
      pt: {
        steps: {
          root: 'p-steps',
          menu: 'p-steps-list',
          menuitem: 'p-steps-item',
          nav: 'p-stepper-nav',
        },
      },
    },
  },
});
