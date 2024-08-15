import DialogStyle from 'primevue/dialog/style';

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-route-meta',
    '@nuxtjs/eslint-module',
    'floating-vue/nuxt',
    '@primevue/nuxt-module',
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
