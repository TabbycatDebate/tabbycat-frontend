<script setup lang="ts">
import vSelect from 'vue-select';

import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.participants',
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getAdjudicators();
tournamentsStore.getTeams();
tournamentsStore.getInstitutions();
tournamentsStore.getPreferences();
tournamentsStore.getBreakCategories();
tournamentsStore.getSpeakerCategories();
const { currentTournament, loading } = storeToRefs(tournamentsStore);

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Participants`,
});

const institutions = computed(() => [
  { name: 'No institution', url: null },
  ...tournamentsStore.institutions,
]);

const instMap = computed(() =>
  Object.fromEntries(
    tournamentsStore.institutions.map((inst) => [inst.url, inst]),
  ),
);

const bcMap = Object.fromEntries(
  tournamentsStore.currentTournament.breakCategories?.map((bc) => [
    bc.url,
    bc,
  ]) ?? [],
);

const scMap = Object.fromEntries(
  tournamentsStore.currentTournament.speakerCategories?.map((sc) => [
    sc.url,
    sc,
  ]) ?? [],
);

const speakerCategories = (speaker) =>
  speaker.categories.map((sc) => scMap[sc]?.name).join(', ');

const minScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences?.feedback?.adj_min_score
      ?.value ?? 0,
);
const maxScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences?.feedback?.adj_max_score
      ?.value ?? 0,
);

const isDragging = ref(false);

const resetDragging = (event) => {
  if (!event.screenX && !event.screenY) {
    isDragging.value = false;
  }
};

const dropFile = (target) => {
  isDragging.value = false;
  target.value = null;
};

function getPersonName(person) {
  return person.name ?? 'Redacted';
}

function getTeamName(team, admin) {
  const useCodes =
    tournamentsStore.currentTournament.preferences.ui_options.team_code_names
      .value;
  const showEmoji =
    tournamentsStore.currentTournament.preferences.ui_options.show_emoji.value;
  const emoji = showEmoji ? `${team.emoji} ` : '';
  const name =
    admin && ['admin-tooltips-real', 'everywhere'].includes(useCodes)
      ? team.codeName
      : team.shortName ?? team.codeName;
  return `${emoji}${name}`;
}

const adjTable = computed(
  () =>
    tournamentsStore.currentTournament.adjudicators?.map((adj) => ({
      obj: adj,
      name: adj.name,
      institution: instMap.value[adj.institution]?.code,
      adjCore: adj.adjCore,
      independent: adj.independent,
    })),
);

const teamTable = computed(
  () =>
    tournamentsStore.currentTournament.teams?.map((team) => ({
      obj: team,
      name: getTeamName(team, true),
      categories: team.breakCategories.map((bc) => bcMap[bc]?.name).join(', '),
      institution: instMap.value[team.institution]?.code,
      subrows: team.speakers.map((speaker) => ({
        content: [
          { component: 'Speaker', obj: speaker, value: getPersonName(speaker) },
          { value: speakerCategories(speaker) },
          { value: '' },
        ],
        key: speaker.url,
        speaker,
        _edit: false,
      })),
    })),
);

const dt = ref();
function exportCSV(event) {
  dt.value.exportCSV();
}
</script>

<template>
  <LayoutsAdmin>
    <div
      @drop.prevent="dropFile($event.dataTransfer)"
      @dragenter="isDragging = true"
      @dragover.prevent
      @dragleave="resetDragging($event)"
    >
      <Transition name="fade-in">
        <div v-if="isDragging" class="upload-overlay">
          <div>Drop .csv files here!</div>
        </div>
      </Transition>
      <PageTitle emoji="🚌">
        Participants
        <template #nav>
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

      <input
        id="file"
        type="file"
        accept="text/csv"
        multiple
        @change="dropFile($event.target)"
      />
      <label for="file" class="note">
        Drag-and-drop CSV files to quickly import participants
      </label>
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
                <button
                  class="btn info small"
                  @click="isCreating = !isCreating"
                >
                  <Icon v-tooltip="'Create'" type="PlusCircle" size="22" />
                </button>
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
            <Column field="institution" sortable>
              <template #header>
                <Icon v-tooltip="'Institution'" type="Home" size="18" />
              </template>
            </Column>
            <Column field="adjCore" sortable>
              <template #header>
                <Icon
                  v-tooltip="'Member of the Adjudication Core'"
                  type="UserCheck"
                  size="18"
                />
              </template>
              <template #body="{ data, field }">
                <Icon v-if="data.obj[field]" type="Check" size="18" />
              </template>
            </Column>
            <Column field="independent" sortable>
              <template #header>
                <Icon
                  v-tooltip="'Independent Adjudicator'"
                  type="UserPlus"
                  size="18"
                />
              </template>
              <template #body="{ data, field }">
                <Icon v-if="data.obj[field]" type="Check" size="18" />
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="card">
          <DataTable
            :value="teamTable"
            sort-mode="multiple"
            :loading="loading.teams !== false"
          >
            <template #header>
              <div class="title">
                <h3>Teams</h3>
                <button class="btn info small" @click="exportCSV($event)">
                  <Icon v-tooltip="'Save as CSV'" type="Clipboard" size="22" />
                </button>
                <button
                  class="btn info small"
                  @click="isCreating = !isCreating"
                >
                  <Icon v-tooltip="'Create'" type="PlusCircle" size="22" />
                </button>
              </div>
            </template>
            <Column field="name" sortable>
              <template #header>
                <Icon v-tooltip="'Name'" type="User" size="18" />
              </template>
              <template #body="{ data, field }">
                <VTooltip style="display: inline">
                  <NuxtLink
                    :to="{
                      name: 'tournament.admin.participants.team',
                      params: {
                        tournamentSlug: currentTournament.slug,
                        id: data.obj.id,
                      },
                    }"
                    >{{ data[field] }}</NuxtLink
                  >

                  <template #popper>
                    {{ data.obj.speakers[0].name }}
                  </template>
                </VTooltip>
              </template>
            </Column>
            <Column field="categories" sortable>
              <template #header>
                <Icon v-tooltip="'Categories'" type="UserCheck" size="18" />
              </template>
            </Column>
            <Column field="institution" sortable>
              <template #header>
                <Icon v-tooltip="'Institution'" type="Home" size="18" />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </LayoutsAdmin>
</template>

<style lang="postcss" scoped>
.tables {
  display: flex;
}

.upload-overlay {
  background-color: var(--background-outset-color);
  height: 100%;
  width: -moz-available;
  width: -webkit-fill-available;
  width: stretch;
  position: fixed;
  z-index: 2;
  padding: 5em;
  display: flex;
  align-items: center;

  > div {
    background-color: var(--background-inset-color);
    width: 100%;
    height: 100%;
    border: 3px dashed var(--border-color);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

input[type='file'] {
  display: none;
}
.note {
  margin: 0.5rem;
  background: var(--background-inset-color);
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 80%;
  padding: 0.5rem;
  display: block;
  cursor: pointer;
}
</style>
