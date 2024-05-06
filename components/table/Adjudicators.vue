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
tournamentsStore.getAdjudicators();
tournamentsStore.getInstitutions();

const { currentTournament, loading } = storeToRefs(tournamentsStore);

const instMap = computed(() =>
  Object.fromEntries(
    tournamentsStore.institutions.map((inst) => [inst.url, inst]),
  ),
);

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
const adjTable = ref();
function exportCSV(table) {
  table.exportCSV();
}

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

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
  <div class="card">
    <DataTable
      ref="adjTable"
      v-model:filters="filters"
      :value="adjData"
      sort-mode="multiple"
      :loading="loading.adjudicators !== false"
      :global-filter-fields="['name', 'institution']"
    >
      <template #header>
        <div class="title">
          <h3>Adjudicators</h3>
          <InputText
            v-model="filters['global'].value"
            placeholder="Search"
            class="searchbar"
          />
          <button
            v-tooltip="'Save as CSV'"
            class="btn info small"
            @click="exportCSV(adjTable)"
          >
            <Icon type="Clipboard" size="22" />
          </button>
          <button
            v-if="editable"
            v-tooltip="'Create'"
            class="btn info small"
            @click="createAdjudicator"
          >
            <Icon type="PlusCircle" size="22" />
          </button>
        </div>
      </template>
      <template #empty>No data available.</template>
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
      <Column v-if="editable" :exportable="false" style="min-width: 1rem">
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

    <Dialog
      v-model:visible="showAdjDialog"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <FormsSingleAdjudicator
        :initial="newAdj"
        @closed="showAdjDialog = !$event"
      />
    </Dialog>
  </div>
</template>
