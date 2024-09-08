import type { UseFetchOptions } from 'nuxt/app';
import * as changeKeys from 'change-case/keys';

const routing = {
  root: { url: () => '/', detail: null, path: [] },
  tournaments: {
    url: () => '/v1/tournaments',
    detail: 'tournamentSlug',
    detailAttr: 'slug',
    path: [],
  },
  rounds: {
    url: ({ tournamentSlug }) => `/v1/tournaments/${tournamentSlug}/rounds`,
    detail: 'roundSeq',
    detailAttr: 'seq',
    path: ['tournamentSlug'],
  },
  teams: {
    url: ({ tournamentSlug }) => `/v1/tournaments/${tournamentSlug}/teams`,
    detail: 'id',
    path: ['tournamentSlug'],
  },
  adjudicators: {
    url: ({ tournamentSlug }) =>
      `/v1/tournaments/${tournamentSlug}/adjudicators`,
    detail: 'id',
    path: ['tournamentSlug'],
  },
  rooms: {
    url: ({ tournamentSlug }) => `/v1/tournaments/${tournamentSlug}/venues`,
    detail: 'id',
    path: ['tournamentSlug'],
  },
  roomCategories: {
    url: ({ tournamentSlug }) =>
      `/v1/tournaments/${tournamentSlug}/venue-categories`,
    detail: 'id',
    path: ['tournamentSlug'],
  },
  institutions: {
    url: () => `/v1/institutions`,
    detail: 'id',
    path: [],
  },
  breakCategories: {
    url: ({ tournamentSlug }) =>
      `/v1/tournaments/${tournamentSlug}/break-categories`,
    detail: 'id',
    path: ['tournamentSlug'],
  },
  speakerCategories: {
    url: ({ tournamentSlug }) =>
      `/v1/tournaments/${tournamentSlug}/speaker-categories`,
    detail: 'id',
    path: ['tournamentSlug'],
  },
  preferences: {
    url: ({ tournamentSlug }) =>
      `/v1/tournaments/${tournamentSlug}/preferences`,
    detail: 'id',
    path: ['tournamentSlug'],
  },
  availabilities: {
    url: ({ tournamentSlug, roundSeq }) =>
      `/v1/tournaments/${tournamentSlug}/rounds/${roundSeq}/availabilities`,
    detail: null,
    path: ['tournamentSlug', 'roundSeq'],
  },
  feedbackQuestions: {
    url: ({ tournamentSlug }) =>
      `/v1/tournaments/${tournamentSlug}/feedback-questions`,
    detail: 'id',
    path: ['tournamentSlug'],
  },
  feedback: {
    url: ({ tournamentSlug }) => `/v1/tournaments/${tournamentSlug}/feedback`,
    detail: 'id',
    path: ['tournamentSlug'],
  },
  draw: {
    url: ({ tournamentSlug, roundSeq }) =>
      `/v1/tournaments/${tournamentSlug}/rounds/${roundSeq}/pairings`,
    detail: null,
    path: ['tournamentSlug', 'roundSeq'],
  },
};

export default function useAPI<T>(
  route,
  options?: UseFetchOptions<T>,
  pathVars? = {},
) {
  const routeObj = routing[route];
  const keyArgs = [];
  if (
    routeObj.path.includes('tournamentSlug') &&
    !('tournamentSlug' in pathVars)
  ) {
    pathVars.tournamentSlug = useState('currentTournamentSlug').value;
    keyArgs.push(pathVars.tournamentSlug);
  }
  if (routeObj.path.includes('roundSeq') && !('roundSeq' in pathVars)) {
    pathVars.roundSeq = useState('currentRoundSeq').value;
    keyArgs.push(pathVars.roundSeq);
  }
  const isDetail = routeObj.detail in pathVars;
  if (isDetail) {
    keyArgs.push(pathVars[routeObj.detail]);
  }

  const url =
    routeObj.url(pathVars) + (isDetail ? `/${pathVars[routeObj.detail]}` : '');
  const key = `${route}${keyArgs.length ? '|' + keyArgs.join('|') : ''}`;
  return useFetch(url, {
    ...options,
    key,
    $fetch: useNuxtApp().$api,
    onResponse({ request, response, options }) {
      response._data = changeKeys.camelCase(response._data, 10);
      if (isDetail) {
        const detailKey = options.key.split('|');
        const objAttr = detailKey.pop();
        const { data } = useNuxtData(detailKey.join('|'));
        if (data.value.length) {
          data.value = data.value.splice(
            data.value.findIndex(
              (item) =>
                item[routeObj.detailAttr ?? routeObj.detail] === objAttr,
            ),
            1,
            response._data,
          );
        }
      } else if (request.method === 'post') {
        const { data } = useNuxtData(key);
        if (data.value?.length) {
          data.value.push(response._data);
        }
      }
    },
    getCachedData(fKey) {
      if (isDetail) {
        const detailKey = fKey.split('|');
        const objAttr = detailKey.pop();
        const { data } = useNuxtData(detailKey.join('|'));
        if (!data.value) {
          return null;
        }
        return data.value.find(
          (item) => item[routeObj.detailAttr ?? routeObj.detail] === objAttr,
        );
      }
      const { data } = useNuxtData(fKey);
      if (!data.value) {
        return null;
      }
      return data;
    },
  });
}
