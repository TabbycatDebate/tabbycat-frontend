<script setup lang="ts">
import InputText from 'primevue/inputtext';
// import { FilterMatchMode } from 'primevue/api';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.participants.institutions',
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getInstitutions();
tournamentsStore.getTeams();
tournamentsStore.getAdjudicators();
const { currentTournament, loading } = storeToRefs(tournamentsStore);

function getInstitutionTeams(institution) {
  return tournamentsStore.currentTournament.teams?.filter(
    (team) => team.institution === institution.url,
  ).length;
}

function getInstitutionAdjudicators(institution) {
  return tournamentsStore.currentTournament.adjudicators?.filter(
    (adj) => adj.institution === institution.url,
  ).length;
}

const institutions = computed(
  () =>
    tournamentsStore.institutions?.map((inst) => ({
      code: inst.code,
      name: inst.name,
      region: inst.region,
      numTeams: getInstitutionTeams(inst),
      numAdjs: getInstitutionAdjudicators(inst),
    })),
);

const dt = ref();
function exportCSV(table) {
  table.exportCSV();
}

const institutionfilters = ref({
  global: { value: null /* matchMode: FilterMatchMode.CONTAINS */ },
});
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🏫">
      Institutions
      <template #nav>
        <NuxtLink
          class="btn outline-primary"
          :to="{
            name: 'tournament.admin.participants',
            params: { tournamentSlug: currentTournament.slug },
          }"
        >
          Participants
        </NuxtLink>
        <NuxtLink class="btn outline-primary">Speaker Categories</NuxtLink>
        <NuxtLink
          class="btn outline-primary"
          :to="{
            name: 'tournament.admin.participants.privateurls',
            params: { tournamentSlug: currentTournament.slug },
          }"
        >
          Private URLs
        </NuxtLink>
      </template>
    </PageTitle>
    <div class="tables">
      <div class="card">
        <TableBase
          :data="institutions"
          :loading="loading.teams !== false || loading.adjudicators !== false"
          :filter-fields="['name', 'code', 'region']"
          :title="$t('institutions.title')"
        >
          <template #actions>
            <button
              v-tooltip="$t('tables.create')"
              class="btn info small"
              @click="isCreating = !isCreating"
            >
              <Icon type="PlusCircle" size="22" />
            </button>
          </template>
          <Column field="code" header="Code" sortable />
          <Column field="name" header="Name" sortable />
          <Column field="region" header="Region" sortable />
          <Column field="numTeams" header="Teams" sortable />
          <Column field="numAdjs" header="Adjudicators" sortable />
        </TableBase>
      </div>
    </div>
  </LayoutsAdmin>
</template>
