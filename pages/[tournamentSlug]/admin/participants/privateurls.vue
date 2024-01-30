<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';
import { storeToRefs } from 'pinia';

definePageMeta({
  name: 'tournament.admin.participants.privateurls',
});

const tournamentsStore = useTournamentsStore();

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Participants - Private URLs`,
});

tournamentsStore.getInstitutions();
tournamentsStore.getTeams();
tournamentsStore.getAdjudicators();
const { currentTournament, loading } = storeToRefs(tournamentsStore);

function getPersonName(person) {
  return person.name ?? 'Redacted';
}

const adjTable = computed(() => ({
  headers: [
    { title: 'Name', icon: 'User' },
    { title: 'URLs' },
  ],
  rows:
  tournamentsStore.currentTournament.adjudicators?.map((adj) => ({
      content: [
        { obj: adj, value: getPersonName(adj) },
        { value: adj.urlKey },
      ],
      subrows: [],
      key: adj.url,
    })) ?? [],
}));

const speakerTable = computed(() => ({
  headers: [
    { title: 'Name', icon: 'User' },
    { title: 'URLs' },
  ],
  rows:
    tournamentsStore.currentTournament.teams?.map((team) => ({
      content: [],
      subrows: team.speakers.map((speaker) => ({
        content: [
          { component: 'Speaker', obj: speaker, value: getPersonName(speaker) },
          { value: speaker.urlKey },
        ],
        key: speaker.url,
      })),
      key: team.url,
    })) ?? [],
}));


</script>

<template>
    <LayoutsAdmin>
      <PageTitle emoji="🎲">Private URLs
        <template #nav>
          <NuxtLink class="btn outline-primary" :to="{
            name: 'tournament.admin.participants',
            params: { tournamentSlug: currentTournament.slug },
          }">Participants</NuxtLink>
          <NuxtLink class="btn outline-primary" :to="{
              name: 'tournament.admin.participants',
              params: { tournamentSlug: currentTournament.slug },
            }">Institutions</NuxtLink>
          <NuxtLink class="btn outline-primary">Speaker Categories</NuxtLink>
        </template>
      </PageTitle>
      <div class="tables">
        <TableBase title="Adjudicators" :content="adjTable"> </TableBase>
        <TableBase title="Speakers" :content="speakerTable"> </TableBase>
      </div>
    </LayoutsAdmin>
</template>
