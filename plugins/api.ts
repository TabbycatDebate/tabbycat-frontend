import * as changeKeys from 'change-case/keys';

export default defineNuxtPlugin((nuxtApp) => {
  const tokenHeader = `Token ${import.meta.env.VITE_TABBYCAT_KEY}`;
  const api = $fetch.create({
    baseURL: `${import.meta.env.VITE_TABBYCAT_URL}/api`,
    onRequest({ options }) {
      if (import.meta.env.VITE_TABBYCAT_KEY) {
        const headers = (options.headers ||= {});
        if (Array.isArray(headers)) {
          headers.push(['Authorization', tokenHeader]);
        } else if (headers instanceof Headers) {
          headers.set('Authorization', tokenHeader);
        } else {
          headers.Authorization = tokenHeader;
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
