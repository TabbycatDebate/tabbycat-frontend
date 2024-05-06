<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.round.availabilities',
});

const tournamentsStore = useTournamentsStore();
const { pageRound } = storeToRefs(tournamentsStore);

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | ${tournamentsStore.pageRound.name} - Availabilities`,
});
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="📍">
      Availabilities
      <template #subtitle>for {{ pageRound.name }}</template>
      <template #nav></template>
    </PageTitle>

    <TabView>
      <TabPanel header="Teams">
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
      </TabPanel>
      <TabPanel header="Adjudicators"></TabPanel>
      <TabPanel header="Rooms"></TabPanel>
    </TabView>
  </LayoutsAdmin>
</template>
