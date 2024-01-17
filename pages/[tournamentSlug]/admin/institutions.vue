<script setup lang="ts">
// import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.participants.institutions',
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getInstitutions();
tournamentsStore.getTeams();
tournamentsStore.getAdjudicators();

function getInstitutionTeams(institution){
  let number = 0;
  for (var team of tournamentsStore.currentTournament.teams){
    if (instMap.value[team.institution]?.code == getInstitutionCode(institution)) {
      number++;
    }
  }
  return number;
}

function getInstitutionAdjudicators(institution){
  let number = 0;
  for (var adj of tournamentsStore.currentTournament.adjudicators){
    if (instMap.value[adj.institution]?.code == getInstitutionCode(institution)) {
      number++;
    }
  }
  return number;
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
        { value: getInstitutionCode(inst) },
        { value: getInstitutionName(inst) },
        { value: getInstitutionRegion(inst) },
        { value: getInstitutionTeams(inst) },
        { value: getInstitutionAdjudicators(inst) },
      ],
      subrows: [],
      key: inst.url,
      institution: inst,
    })) ?? [],
}));

</script>

<template>
    <LayoutsAdmin>
    <PageTitle emoji="🏫">Institutions
      <template #nav>
          <NuxtLink class="btn outline-primary" to="./participants">Participants</NuxtLink>
          <NuxtLink class="btn outline-primary">Speaker Categories</NuxtLink>
          <NuxtLink class="btn outline-primary">Private URLs</NuxtLink>
        </template>
    </PageTitle>
    <div class="tables">
      <TableBase
        title="Institutions"
        :content="institutionsTable"
      >
      </TableBase>
    </div>
  </LayoutsAdmin>
</template>