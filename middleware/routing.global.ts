export default defineNuxtRouteMiddleware(async (to, _from) => {
  const currentTournamentSlug = useState('currentTournamentSlug');
  const currentRoundSeq = useState('currentRoundSeq');
  if ('tournamentSlug' in to.params) {
    currentTournamentSlug.value = to.params.tournamentSlug;
    const { data: tournamentData } = await useAPI('tournaments');
    if (
      !tournamentData.value.find(
        ({ slug }) => slug === to.params.tournamentSlug,
      )
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tournament not found',
      });
    }

    if ('roundSeq' in to.params) {
      currentRoundSeq.value = to.params.roundSeq;
      const { data: roundData } = await useAPI('rounds');
      if (!roundData.value) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Round not found',
        });
      }
    } else {
      currentRoundSeq.value = null;
    }
  } else {
    currentTournamentSlug.value = null;
    currentRoundSeq.value = null;
  }
});
