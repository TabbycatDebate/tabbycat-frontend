import FloatingVue from 'floating-vue'

export default defineNuxtPlugin((nuxtApp) => {
    FloatingVue.options.themes['full-context'] = {
        ...FloatingVue.options.themes.tooltip,
        '$resetCss': true,
    };
});