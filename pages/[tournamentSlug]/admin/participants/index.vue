<script setup lang="ts">
import * as Papa from 'papaparse';

import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.participants',
});

const tournamentsStore = useTournamentsStore();
const { currentTournament } = storeToRefs(tournamentsStore);
useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Participants`,
});

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
          <div>{{ $t('participants.csv.import') }}</div>
        </div>
      </Transition>
      <PageTitle emoji="🚌">
        {{ $t('nav.participants') }}
        <template #nav>
          <NuxtLink
            class="btn outline-primary"
            :to="{
              name: 'tournament.admin.participants.institutions',
              params: { tournamentSlug: currentTournament.slug },
            }"
          >
            {{ $t('nav.institutions') }}
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

      <input
        id="file"
        type="file"
        accept="text/csv"
        multiple
        @change="dropFile($event.target)"
      />
      <label for="file" class="note">
        {{ $t('participants.csv.dragDrop') }}
      </label>
      <div class="tables">
        <TableAdjudicators :editable="true" />
        <TableTeams :editable="true" />
      </div>
    </div>
    <Dialog
      v-model:visible="isProcessingFiles"
      :style="{ width: '450px' }"
      :modal="true"
      :header="$t('participants.csv.header')"
    >
      <template v-if="reconcilingFile === null">
        <DataTable
          :value="fileList"
          sort-mode="single"
          :loading="loading.adjudicators !== false"
          edit-mode="cell"
        >
          <Column
            field="name"
            :header="$t('participants.csv.fileName')"
            sortable
          />
          <Column field="role" :header="$t('participants.csv.data')" sortable>
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
          {{ $t('participants.csv.nextStep') }}
        </button>
      </template>
      <template v-else>
        <DataTable
          :value="currentCSV.data"
          paginator
          paginator-template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          current-page-report-template="{first} to {last} of {totalRecords}"
          :rows="5"
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
  margin: 0.5rem 0;
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
