import { defineStore } from 'pinia';

export const useUsersStore = defineStore({
  id: 'users-store',
  state: () => {
    return {
      _token: 'b6fba1387e1520e6b41f8b1241e9a0ea96091d8e',
      _user: {},
    };
  },
  actions: {},
  getters: {
    token: (state) => state._token,
    user: (state) => state._user,
  },
});
