<script setup lang="ts">
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from 'primevue/api';

import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

interface Props {
  editable: boolean;
}
const { editable } = withDefaults(defineProps<Props>(), {
  editable: false,
});

const tournamentsStore = useTournamentsStore();
const bcMap = ref({});
const scMap = ref({});
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

const instMap = computed(() =>
  Object.fromEntries(
    tournamentsStore.institutions.map((inst) => [inst.url, inst]),
  ),
);

const useEmoji = computed(
  () => tournamentsStore.currentTournament.preferences?.ui_options?.show_emoji,
);

function getTeamName(team, admin) {
  const useCodes =
    tournamentsStore.currentTournament.preferences?.ui_options?.team_code_names
      ?.value;
  return admin && ['admin-tooltips-real', 'everywhere'].includes(useCodes)
    ? team.codeName
    : team.shortName ?? team.codeName;
}

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

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
  <div class="card">
    <DataTable
      ref="teamTable"
      v-model:filters="filters"
      :value="teamData"
      sort-mode="multiple"
      :loading="loading.teams !== false"
      :expanded-rows="teamExpandedRows"
      data-key="url"
      :global-filter-fields="['name', 'categories', 'institution', 'speakers']"
    >
      <template #header>
        <div class="title">
          <h3>Teams</h3>
          <InputText
            v-model="filters['global'].value"
            placeholder="Search"
            class="searchbar"
          />
          <button
            v-tooltip="'Save as CSV'"
            class="btn info small"
            @click="exportCSV(teamTable)"
          >
            <Icon type="Clipboard" size="22" />
          </button>
          <button
            v-if="editable"
            v-tooltip="'Create'"
            class="btn info small"
            @click="createTeam"
          >
            <Icon type="PlusCircle" size="22" />
          </button>
        </div>
      </template>
      <template #empty>No data available.</template>
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
              <span v-if="useEmoji" class="emoji">{{ data.obj.emoji }}</span>
              {{ data.name }}
            </NuxtLink>

            <template #popper>
              <h6>
                <span v-if="useEmoji" class="emoji">{{ data.obj.emoji }}</span>
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
          <Icon v-tooltip="'Break Categories'" type="UserCheck" size="18" />
        </template>
      </Column>
      <Column field="institution" sortable>
        <template #header>
          <Icon v-tooltip="'Institution'" type="Home" size="18" />
        </template>
      </Column>
      <Column v-if="editable" :exportable="false" style="min-width: 1rem">
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
    <Dialog
      v-model:visible="showTeamDialog"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <FormsSingleTeam :initial="newTeam" @closed="showTeamDialog = !$event" />
    </Dialog>
  </div>
</template>
