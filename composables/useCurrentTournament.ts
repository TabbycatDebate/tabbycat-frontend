export default async function useCurrentTournament() {
  const { data } = await useAPI(
    'tournaments',
    {},
    { tournamentSlug: useState('currentTournamentSlug').value },
  );
  return data;
}
