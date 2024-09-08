export default async function useCurrentRound() {
  const { data } = await useAPI(
    'rounds',
    {},
    { roundSeq: useState('currentRoundSeq').value },
  );
  return data;
}
