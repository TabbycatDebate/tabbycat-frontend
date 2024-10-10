import * as changeKeys from 'change-case/keys';
//import { useI18n } from 'vue-i18n';

export default defineNuxtPlugin((nuxtApp) => {
  const locale = { value: 'en' };//nuxtApp.$i18n.locale;
  const tokenHeader = `Token ${import.meta.env.VITE_TABBYCAT_KEY}`;
  const api = $fetch.create({
    baseURL: `${import.meta.env.VITE_TABBYCAT_URL}/api`,
    onRequest({ options }) {
      if (import.meta.env.VITE_TABBYCAT_KEY) {
        const headers = (options.headers ||= {});
        if (Array.isArray(headers)) {
          headers.push(['Authorization', tokenHeader]);
          headers.push(['Accept-Language', locale.value])
        } else if (headers instanceof Headers) {
          headers.set('Authorization', tokenHeader);
          headers.set('Accept-Language', locale.value)
        } else {
          headers.Authorization = tokenHeader;
          headers['Accept-Language'] = locale.value;
        }
      }
      if (options.body !== undefined) {
        options.body = changeKeys.snakeCase(options.body);
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'));
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
