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

tournamentsStore.getSpeakers();
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
    tournamentsStore.currentTournament.speakers?.map((spk) => ({
      obj: spk,
      name: spk.name,
      urlKey: spk.urlKey,
    })),
);
const speakerfilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const adjudicatorfilters = ref({
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
    <div class="tables">
      <div class="card">
        <DataTable
          ref="dt"
          :value="adjTable"
          sort-mode="multiple"
          :loading="loading.adjudicators !== false"
          v-model:filters="adjudicatorfilters"
          :globalFilterFields="['name', 'urlKey']"
        >
          <template #header>
            <div class="title">
              <h3>Adjudicators</h3>
              <InputText v-model="adjudicatorfilters['global'].value" placeholder="Search Adjudicators" class="searchbar small" />
              <button v-tooltip="'Save as CSV'" class="btn info small" @click="exportCSV($event)">
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
          :value="speakerTable"
          sort-mode="multiple"
          :loading="loading.speakers !== false"
          v-model:filters="speakerfilters"
          :globalFilterFields="['name', 'urlKey']"
        >
          <template #header>
            <div class="title">
              <h3>Speakers</h3>
              <InputText v-model="speakerfilters['global'].value" placeholder="Search Speakers" class="searchbar small" />
              <button v-tooltip="'Save as CSV'" class="btn info small" @click="exportCSV($event)">
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
