<script setup lang="ts">
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
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🏫">
      {{ $t('nav.institutions') }}
      <template #nav>
        <NuxtLink
          class="btn outline-primary"
          :to="{
            name: 'tournament.admin.participants',
            params: { tournamentSlug: currentTournament.slug },
          }"
        >
          {{ $t('nav.participants') }}
        </NuxtLink>
        <NuxtLink class="btn outline-primary">{{
          $t('nav.speakerCategories')
        }}</NuxtLink>
        <NuxtLink
          class="btn outline-primary"
          :to="{
            name: 'tournament.admin.participants.privateurls',
            params: { tournamentSlug: currentTournament.slug },
          }"
        >
          {{ $t('nav.privateURLs') }}
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
          <Column field="code" :header="$t('institutions.code')" sortable />
          <Column field="name" :header="$t('institutions.name')" sortable />
          <Column field="region" :header="$t('institutions.region')" sortable />
          <Column
            field="numTeams"
            :header="$t('institutions.numberTeams')"
            sortable
          />
          <Column
            field="numAdjs"
            :header="$t('institutions.numberAdjudicators')"
            sortable
          />
        </TableBase>
      </div>
    </div>
  </LayoutsAdmin>
</template>
