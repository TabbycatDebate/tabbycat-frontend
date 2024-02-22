<script setup lang="ts">
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from 'primevue/api';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.participants.privateurls',
});

const tournamentsStore = useTournamentsStore();

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Private URLs`,
});

tournamentsStore.getTeams();
tournamentsStore.getAdjudicators();
const { currentTournament, loading } = storeToRefs(tournamentsStore);

const adjTable = computed(
  () =>
    tournamentsStore.currentTournament.adjudicators?.map((adj) => ({
      obj: adj,
      name: adj.name,
      urlKey: adj.urlKey,
    })),
);
const speakerTable = computed(
  () =>
    tournamentsStore.currentTournament.teams
      ?.map((team) =>
        team.speakers.map((spk) => ({
          obj: spk,
          name: spk.name,
          urlKey: spk.urlKey,
          team: team.shortName,
        })),
      )
      .flat(),
);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🎲">
      Private URLs
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
        <NuxtLink
          class="btn outline-primary"
          :to="{
            name: 'tournament.admin.participants.institutions',
            params: { tournamentSlug: currentTournament.slug },
          }"
        >
          Institutions
        </NuxtLink>
        <NuxtLink class="btn outline-primary">Speaker Categories</NuxtLink>
      </template>
    </PageTitle>

    <InputText
      v-model="filters['global'].value"
      placeholder="Search"
      class="searchbar"
    />

    <div class="tables">
      <div class="card">
        <DataTable
          ref="dt"
          v-model:filters="filters"
          :value="adjTable"
          sort-mode="multiple"
          :loading="loading.adjudicators !== false"
          :global-filter-fields="['name', 'urlKey']"
        >
          <template #header>
            <div class="title">
              <h3>Adjudicators</h3>
              <button
                v-tooltip="'Save as CSV'"
                class="btn info small"
                @click="exportCSV($event)"
              >
                <Icon type="Clipboard" size="22" />
              </button>
              <NuxtLink v-tooltip="'Print'" class="btn info small" to="">
                <Icon type="Printer" size="22" />
              </NuxtLink>
            </div>
          </template>
          <Column field="name" sortable>
            <template #header>
              <Icon v-tooltip="'Name'" type="User" size="18" />
            </template>
            <template #body="{ data }">
              <TableAdjudicatorCell :adjudicator="data.obj" />
            </template>
          </Column>
          <Column field="urlKey" sortable style="width: 10em">
            <template #header>
              <Icon v-tooltip="'URL Key'" type="Key" size="18" />
            </template>
            <template #body="{ data }">
              <div class="url-link">{{ data.obj.urlKey }}</div>
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="card">
        <DataTable
          ref="dt"
          v-model:filters="filters"
          :value="speakerTable"
          sort-mode="multiple"
          :loading="loading.teams !== false"
          :global-filter-fields="['name', 'urlKey', 'team']"
        >
          <template #header>
            <div class="title">
              <h3>Speakers</h3>
              <button
                v-tooltip="'Save as CSV'"
                class="btn info small"
                @click="exportCSV($event)"
              >
                <Icon type="Clipboard" size="22" />
              </button>
              <NuxtLink v-tooltip="'Print'" class="btn info small" to="">
                <Icon type="Printer" size="22" />
              </NuxtLink>
            </div>
          </template>
          <Column field="name" sortable>
            <template #header>
              <Icon v-tooltip="'Name'" type="User" size="18" />
            </template>
            <template #body="{ data }">
              <div v-if="data.obj.anonymous" class="redacted">
                {{ data.obj.name || 'Anonymous' }}
              </div>
              <template v-else>{{ data.obj.name }}</template>
            </template>
          </Column>
          <Column field="urlKey" sortable style="width: 10em">
            <template #header>
              <Icon v-tooltip="'URL Key'" type="Key" size="18" />
            </template>
            <template #body="{ data }">
              <div class="url-link">{{ data.obj.urlKey }}</div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </LayoutsAdmin>
</template>
