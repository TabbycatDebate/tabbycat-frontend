export default async function useCurrentRound() {
  const { data } = await useAPI(
    'rounds',
    {},
    { seq: useState('currentRoundSeq').value },
  );
  return data;
}
