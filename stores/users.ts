import { defineStore } from 'pinia';

export const useUsersStore = defineStore({
  id: 'users-store',
  state: () => ({
    _token: import.meta.env.VITE_TABBYCAT_KEY,
    _user: {},
  }),
  actions: {
    hasPerm(perm) {
      if (state._user.is_superuser || state._user.is_staff) return true;
      const {
        currentTournament: { url },
      } = useTournamentsStore();
      return (
        state._user.tournaments.find(({ tournament }) => tournament === url)
          ?.permissions ?? []
      ).includes(perm);
    },
  },
  getters: {
    token: (state) => state._token,
    user: (state) => state._user,
  },
});
