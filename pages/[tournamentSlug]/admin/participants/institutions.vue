<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';
import { storeToRefs } from 'pinia';

definePageMeta({
  name: 'tournament.admin.participants.institutions',
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getInstitutions();
tournamentsStore.getTeams();
tournamentsStore.getAdjudicators();
const { currentTournament, loading } = storeToRefs(tournamentsStore);

function getInstitutionTeams(institution) {
  return tournamentsStore.currentTournament.teams.filter(
    (team) => team.institution === institution.url,
  ).length;
}

function getInstitutionAdjudicators(institution) {
  return tournamentsStore.currentTournament.adjudicators.filter(
    (adj) => adj.institution === institution.url,
  ).length;
}

const institutionsTable = computed(() => ({
  headers: [
    { title: 'Code Name' },
    { title: 'Institution' },
    { title: 'Region' },
    { title: 'Teams' },
    { title: 'Adjudicators' },
  ],
  rows:
    tournamentsStore.institutions?.map((inst) => ({
      content: [
        { value: inst.code },
        { value: inst.name },
        { value: inst.region },
        { value: getInstitutionTeams(inst) },
        { value: getInstitutionAdjudicators(inst) },
      ],
      subrows: [],
      key: inst.url,
    })) ?? [],
}));
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🏫"
      >Institutions
      <template #nav>
        <NuxtLink
          class="btn outline-primary"
          :to="{
            name: 'tournament.admin.participants',
            params: { tournamentSlug: currentTournament.slug },
          }"
          >Participants</NuxtLink
        >
        <NuxtLink class="btn outline-primary">Speaker Categories</NuxtLink>
        <NuxtLink
          class="btn outline-primary"
          :to="{
            name: 'tournament.admin.participants.privateurls',
            params: { tournamentSlug: currentTournament.slug },
          }"
          >Private URLs</NuxtLink
        >
      </template>
    </PageTitle>
    <div class="tables">
      <TableBase title="Institutions" :content="institutionsTable"> </TableBase>
    </div>
  </LayoutsAdmin>
</template>
