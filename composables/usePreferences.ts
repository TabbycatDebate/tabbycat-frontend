import * as changeKeys from 'change-case/keys';

export default async function usePreferences() {
  const { data } = await useAPI('preferences');
  return changeKeys.camelCase(
    Object.fromEntries(
      Object.entries(groupBy(data.value ?? [], ({ section }) => section)).map(
        ([key, val]) => [
          key,
          Object.fromEntries(
            Object.entries(groupBy(val, ({ name }) => name)).map(
              ([key, val]) => [key, val[0]],
            ),
          ),
        ],
      ),
    ),
    2,
  );
}
