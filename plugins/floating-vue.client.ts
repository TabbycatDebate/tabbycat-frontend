import FloatingVue from 'floating-vue';

export default defineNuxtPlugin((_nuxtApp) => {
  FloatingVue.options.themes['full-context'] = {
    ...FloatingVue.options.themes.tooltip,
    $resetCss: true,
  };
});
