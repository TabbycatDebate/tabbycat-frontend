<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.participants.privateurls',
});

const tournamentsStore = useTournamentsStore();

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Participants - Private URLs`,
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
        >
          <template #header>
            <div class="title">
              <h3>Adjudicators</h3>
              <button class="btn info small" @click="exportCSV($event)">
                <Icon v-tooltip="'Save as CSV'" type="Clipboard" size="22" />
              </button>
              <NuxtLink class="btn info small" to="">
                <Icon v-tooltip="'Print'" type="Printer" size="22" />
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
          <Column field="urlKey" sortable>
            <template #header>
              <Icon v-tooltip="'URL Key'" type="Key" size="18" />
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
        >
          <template #header>
            <div class="title">
              <h3>Speakers</h3>
              <button class="btn info small" @click="exportCSV($event)">
                <Icon v-tooltip="'Save as CSV'" type="Clipboard" size="22" />
              </button>
              <NuxtLink class="btn info small" to="">
                <Icon v-tooltip="'Print'" type="Printer" size="22" />
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
          <Column field="urlKey" sortable>
            <template #header>
              <Icon v-tooltip="'URL Key'" type="Key" size="18" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </LayoutsAdmin>
</template>
