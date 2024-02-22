<script setup lang="ts">
import * as Papa from 'papaparse';
import PaginatorStyle from 'primevue/paginator/style';

import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.participants',
});

const tournamentsStore = useTournamentsStore();
const bcMap = ref({});
const scMap = ref({});
tournamentsStore.getAdjudicators();
tournamentsStore.getTeams();
tournamentsStore.getInstitutions();
tournamentsStore.getPreferences();
tournamentsStore.getBreakCategories().then(() => {
  bcMap.value = Object.fromEntries(
    tournamentsStore.currentTournament.breakCategories?.map((bc) => [
      bc.url,
      bc,
    ]) ?? [],
  );
});
tournamentsStore.getSpeakerCategories().then(() => {
  scMap.value = Object.fromEntries(
    tournamentsStore.currentTournament.speakerCategories?.map((sc) => [
      sc.url,
      sc,
    ]) ?? [],
  );
});
const { currentTournament, loading } = storeToRefs(tournamentsStore);

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Participants`,
});

const instMap = computed(() =>
  Object.fromEntries(
    tournamentsStore.institutions.map((inst) => [inst.url, inst]),
  ),
);

const isDragging = ref(false);

const resetDragging = (event) => {
  if (!event.screenX && !event.screenY) {
    isDragging.value = false;
  }
};

const isProcessingFiles = ref(false);
const reconcilingFile = ref(null);
const currentCSV = ref(null);
const fileList = ref([]);
watch(isProcessingFiles, (to, _from) => {
  if (!to) {
    fileList.value = [];
  }
});
const dropFile = (target) => {
  isDragging.value = false;
  fileList.value = [...target.files].map((file) => ({
    name: file.name,
    file,
    role:
      csvFileNames.find(
        ({ fileName }) =>
          fileName.localeCompare(file.name.slice(0, -4), 'en', {
            sensitivity: 'base',
          }) === 0,
      )?.fileName ?? '',
  }));
  isProcessingFiles.value = true;
};
const csvsNamed = () => {
  fileList.value = fileList.value.sort(
    (a, b) =>
      csvFileNames.indexOf(itemsArray[a].role) -
      csvFileNames.indexOf(itemsArray[b].role),
  );
  reconcilingFile.value = fileList.value[0];
  Papa.parse(fileList.value[0].file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      currentCSV.value = results;
    },
  });
};

function getPersonName(person) {
  return person.name ?? 'Redacted';
}

function getTeamName(team, admin) {
  const useCodes =
    tournamentsStore.currentTournament.preferences?.ui_options?.team_code_names
      ?.value;
  const showEmoji =
    tournamentsStore.currentTournament.preferences?.ui_options?.show_emoji
      ?.value;
  const emoji = showEmoji ? `${team.emoji} ` : '';
  const name =
    admin && ['admin-tooltips-real', 'everywhere'].includes(useCodes)
      ? team.codeName
      : team.shortName ?? team.codeName;
  return `${emoji}${name}`;
}

const adjData = computed(
  () =>
    tournamentsStore.currentTournament.adjudicators?.map((adj) => ({
      obj: adj,
      name: adj.name,
      institution: instMap.value[adj.institution]?.code,
      adjCore: adj.adjCore,
      independent: adj.independent,
    })),
);

const teamData = computed(
  () =>
    tournamentsStore.currentTournament.teams?.map((team) => ({
      obj: team,
      url: team.url,
      name: getTeamName(team, true),
      categories: team.breakCategories
        .map((bc) => bcMap.value[bc]?.name)
        .join(', '),
      institution: instMap.value[team.institution]?.code,
      speakers: team.speakers.map(({ name }) => name).join(', '),
      speakerTable: team.speakers.map((speaker) => ({
        obj: speaker,
        url: speaker.url,
        name: getPersonName(speaker),
        categories: speaker.categories
          .map((sc) => scMap.value[sc]?.name)
          .join(', '),
      })),
    })),
);

const adjTable = ref();
const teamTable = ref();
function exportCSV(table) {
  table.exportCSV();
}
const teamExpandedRows = ref([]);
const expandAll = () => {
  teamExpandedRows.value = products.value.reduce(
    (acc, p) => (acc[p.id] = true) && acc,
    {},
  );
};
const collapseAll = () => {
  teamExpandedRows.value = null;
};

const showAdjDialog = ref(false);
const submittedAdj = ref(false);
const newAdj = ref({});
function createAdjudicator() {
  newAdj.value = {};
  submittedAdj.value = false;
  showAdjDialog.value = true;
}
function saveAdjudicator() {
  submittedAdj.value = true;
}
function editAdj(adj) {
  newAdj.value = { ...adj };
  showAdjDialog.value = true;
}

const showTeamDialog = ref(false);
const submittedTeam = ref(false);
const newTeam = ref({});
function createTeam() {
  newTeam.value = {};
  submittedTeam.value = false;
  showTeamDialog.value = true;
}
function saveTeam() {
  submittedTeam.value = true;
}
function editTeam(team) {
  newTeam.value = { ...team };
  showTeamDialog.value = true;
}

const paginatorPt = ref({
  paginator: {
    ...PaginatorStyle.classes,
    root: PaginatorStyle.classes.paginator,
  },
});
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
            ref="adjTable"
            :value="adjData"
            sort-mode="multiple"
            :loading="loading.adjudicators !== false"
          >
            <template #header>
              <div class="title">
                <h3>Adjudicators</h3>
                <button
                  v-tooltip="'Save as CSV'"
                  class="btn info small"
                  @click="exportCSV(adjTable)"
                >
                  <Icon type="Clipboard" size="22" />
                </button>
                <button
                  v-tooltip="'Create'"
                  class="btn info small"
                  @click="createAdjudicator"
                >
                  <Icon type="PlusCircle" size="22" />
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
            <Column :exportable="false" style="min-width: 1rem">
              <template #body="{ data }">
                <Icon
                  type="Pencil"
                  size="18"
                  class="icon-btn"
                  @click="editAdj(data.obj)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="card">
          <DataTable
            ref="teamTable"
            :value="teamData"
            sort-mode="multiple"
            :loading="loading.teams !== false"
            :expanded-rows="teamExpandedRows"
            data-key="url"
          >
            <template #header>
              <div class="title">
                <h3>Teams</h3>
                <button
                  v-tooltip="'Save as CSV'"
                  class="btn info small"
                  @click="exportCSV(teamTable)"
                >
                  <Icon type="Clipboard" size="22" />
                </button>
                <button
                  v-tooltip="'Create'"
                  class="btn info small"
                  @click="createTeam"
                >
                  <Icon type="PlusCircle" size="22" />
                </button>
              </div>
            </template>
            <Column expander style="width: 30px" />
            <Column field="name" sortable>
              <template #header>
                <Icon v-tooltip="'Name'" type="User" size="18" />
              </template>
              <template #body="{ data, field }">
                <VTooltip style="display: inline" theme="full-context">
                  <NuxtLink
                    :to="{
                      name: 'tournament.admin.participants.team',
                      params: {
                        tournamentSlug: currentTournament.slug,
                        id: data.obj.id,
                      },
                    }"
                  >
                    {{ data[field] }}
                  </NuxtLink>

                  <template #popper>
                    <h6>
                      {{ data.obj.longName }}
                    </h6>
                    <hr />
                    <div class="popover-content">
                      {{ data.speakers }}
                    </div>
                  </template>
                </VTooltip>
              </template>
            </Column>
            <Column field="categories" sortable>
              <template #header>
                <Icon
                  v-tooltip="'Break Categories'"
                  type="UserCheck"
                  size="18"
                />
              </template>
            </Column>
            <Column field="institution" sortable>
              <template #header>
                <Icon v-tooltip="'Institution'" type="Home" size="18" />
              </template>
            </Column>
            <Column :exportable="false" style="min-width: 1rem">
              <template #body="{ data }">
                <Icon
                  type="Pencil"
                  size="18"
                  class="icon-btn"
                  @click="editTeam(data.obj)"
                />
              </template>
            </Column>
            <template #expansion="slotProps">
              <DataTable
                :value="slotProps.data.speakerTable"
                data-key="url"
                class="subtable"
              >
                <Column field="name" sortable>
                  <template #header>
                    <Icon v-tooltip="'Name'" type="User" size="18" />
                  </template>
                  <template #body="{ data }">
                    <div :class="{ redacted: data.obj.anonymous }">
                      {{ data.obj.name || 'Redacted' }}
                    </div>
                  </template>
                </Column>
                <Column field="categories" sortable>
                  <template #header>
                    <Icon
                      v-tooltip="'Speaker Categories'"
                      type="UserCheck"
                      size="18"
                    />
                  </template>
                </Column>
              </DataTable>
            </template>
          </DataTable>
        </div>
      </div>
    </div>
    <Dialog
      v-model:visible="showAdjDialog"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <FormsSingleAdjudicator :initial="newAdj" />
    </Dialog>
    <Dialog
      v-model:visible="showTeamDialog"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <FormsSingleTeam :initial="newTeam" />
    </Dialog>
    <Dialog
      v-model:visible="isProcessingFiles"
      :style="{ width: '450px' }"
      :modal="true"
      header="CSV Upload"
    >
      <template v-if="reconcilingFile === null">
        <DataTable
          :value="fileList"
          sort-mode="single"
          :loading="loading.adjudicators !== false"
          edit-mode="cell"
        >
          <Column field="name" header="File name" sortable />
          <Column field="role" header="Data" sortable>
            <template #body="{ data, field }">
              {{ csvNameMapping[data[field]] }}
            </template>
            <template #editor="{ data, field }">
              <select v-model="data[field]" autofocus class="form-control">
                <option
                  v-for="g in csvFileNames"
                  :key="g.fileName"
                  :value="g.fileName"
                >
                  {{ g.name }}
                </option>
              </select>
            </template>
          </Column>
        </DataTable>
        <button class="form-control btn-success" @click="csvsNamed">
          Next step
        </button>
      </template>
      <template v-else>
        <DataTable
          :value="currentCSV.data"
          paginator
          paginator-template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          current-page-report-template="{first} to {last} of {totalRecords}"
          :rows="5"
          :pt="paginatorPt"
        >
          <Column
            v-for="col in currentCSV.meta.fields"
            :key="col"
            :header="col"
            :field="col"
          />
        </DataTable>
      </template>
    </Dialog>
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

.subtable {
  margin-left: 30px;
}
</style>
