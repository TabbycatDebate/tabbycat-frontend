import { useTournamentsStore } from '~/stores/tournaments';

export default defineNuxtRouteMiddleware(async (to, _from) => {
  if ('tournamentSlug' in to.params) {
    const tournamentsStore = useTournamentsStore();
    if (tournamentsStore.tournaments.length === 0) {
      await tournamentsStore.getTournaments();
    }
    if (to.params.tournamentSlug !== tournamentsStore.currentTournament?.slug) {
      tournamentsStore.setCurrentTournament(to.params.tournamentSlug);
    }
  }
});
