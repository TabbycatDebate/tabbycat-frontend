import { defineStore } from 'pinia';

export const useUsersStore = defineStore({
  id: 'users-store',
  state: () => ({
    _token: import.meta.env.VITE_TABBYCAT_KEY,
    _user: {},
  }),
  actions: {},
  getters: {
    token: (state) => state._token,
    user: (state) => state._user,
  },
});
