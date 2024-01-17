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

const teamCategories = (team) =>
  team.breakCategories.map((bc) => bcMap[bc]?.name).join(', ');
const speakerCategories = (speaker) =>
  speaker.categories.map((sc) => scMap[sc]?.name).join(', ');

const minScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences?.find(
      (pref) => pref.identifier === 'feedback__adj_min_score',
    ).value ?? 0,
);
const maxScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences?.find(
      (pref) => pref.identifier === 'feedback__adj_max_score',
    ).value ?? 0,
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

function getTeamName(team) {
  return team.emoji + ' ' + team.shortName;
}

function getPersonName(person) {
  return person.name ?? 'Redacted';
}

const adjTable = computed(() => ({
  headers: [
    { title: 'Name', icon: 'User' },
    { title: 'Institution', icon: 'Home' },
    { title: 'Member of the Adjudication Core', icon: 'UserCheck' },
    { title: 'Independent Adjudicator', icon: 'UserPlus' },
  ],
  rows:
    tournamentsStore.currentTournament.adjudicators?.map((adj) => ({
      content: [
        { component: 'Adjudicator', obj: adj, value: getPersonName(adj) },
        { value: instMap.value[adj.institution]?.code || '' },
        { component: 'Checkmark', value: adj.adjCore },
        { component: 'Checkmark', value: adj.independent },
      ],
      subrows: [],
      key: adj.url,
      adjudicator: adj,
    })) ?? [],
}));

const teamTable = computed(() => ({
  headers: [
    { title: 'Name', icon: 'User' },
    { title: 'Categories', icon: 'UserCheck' },
    { title: 'Institution', icon: 'Home' },
  ],
  rows:
    tournamentsStore.currentTournament.teams?.map((team) => ({
      content: [
        {
          component: 'Team',
          obj: team,
          value: getTeamName(team),
          sort: team.shortName,
        },
        { value: teamCategories(team) },
        { value: instMap.value[team.institution]?.code || '' },
      ],
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
      key: team.url,
      team,
      _edit: false,
    })) ?? [],
}));
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
          <NuxtLink class="btn outline-primary">Institutions</NuxtLink>
          <NuxtLink class="btn outline-primary">Speaker Categories</NuxtLink>
          <NuxtLink class="btn outline-primary">Private URLs</NuxtLink>
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
        <TableBase
          title="Adjudicators"
          :content="adjTable"
          :can-create="true"
          :can-edit="true"
        >
          <template #create>
            <LazyFormsSingleAdjudicator />
          </template>
          <template #edit="{ row: { adjudicator } }">
            <form @submit.prevent="updateAdjudicator(adjudicator)">
              <div class="form-group combined">
                <div>
                  <label for="institution">Institution</label>
                  <vSelect
                    v-model="adjudicator.institution"
                    input-id="institution"
                    :loading="loading.institutions"
                    name="institution"
                    :options="institutions"
                    :reduce="(inst) => inst.url"
                    label="name"
                    :clearable="false"
                  />
                </div>
                <div>
                  <label
                    v-tooltip="'Independent Adjudicator'"
                    for="independent"
                  >
                    IA
                  </label>
                  <input
                    id="independent"
                    v-model="adjudicator.independent"
                    type="checkbox"
                    class="form-control"
                    name="independent"
                  />
                </div>
              </div>
              <div class="form-group combined">
                <div>
                  <label for="name">Name</label>
                  <input
                    id="name"
                    v-model="adjudicator.name"
                    name="name"
                    type="text"
                    class="form-control"
                  />
                </div>
                <FormsFieldsGender v-model="adjudicator.gender" />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="adjudicator.email"
                  name="email"
                  type="email"
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="score">Base score</label>
                <input
                  id="score"
                  v-model="adjudicator.baseScore"
                  name="score"
                  type="number"
                  class="form-control"
                  :min="minScore"
                  :max="maxScore"
                  step="any"
                />
              </div>
              <div class="form-group">
                <label for="adj-conflicts">Adjudicator conflicts</label>
                <vSelect
                  v-model="adjudicator.adjudicatorConflicts"
                  input-id="adj-conflicts"
                  :loading="loading.adjudicators"
                  name="adj-conflicts"
                  :options="currentTournament.adjudicators"
                  :reduce="(adj) => adj.url"
                  label="name"
                  :clearable="false"
                  multiple
                />
              </div>
              <div class="form-group">
                <label for="team-conflicts">Team conflicts</label>
                <vSelect
                  v-model="adjudicator.teamConflicts"
                  input-id="team-conflicts"
                  :loading="loading.teams"
                  name="team-conflicts"
                  :options="currentTournament.teams"
                  :reduce="(team) => team.url"
                  label="shortName"
                  :clearable="false"
                  multiple
                />
              </div>
              <div class="form-group">
                <label for="institution-conflicts">Institution conflicts</label>
                <vSelect
                  v-model="adjudicator.institutionConflicts"
                  input-id="institution-conflicts"
                  :loading="loading.institutions"
                  name="institution-conflicts"
                  :options="institutions"
                  :reduce="(inst) => inst.url"
                  label="code"
                  :clearable="false"
                  multiple
                />
              </div>
              <div class="form-group">
                <input
                  id="adjCore"
                  v-model="adjudicator.adjCore"
                  type="checkbox"
                  name="adjCore"
                  class="form-control"
                />
                <label for="adjCore">Member of the Adjudication Core</label>
              </div>
              <div class="form-group">
                <input
                  id="trainee"
                  v-model="adjudicator.trainee"
                  type="checkbox"
                  name="trainee"
                  class="form-control"
                />
                <label for="trainee">Always allocate as trainee</label>
              </div>
              <div class="form-group">
                <input
                  id="anonymous"
                  v-model="adjudicator.anonymous"
                  type="checkbox"
                  name="anonymous"
                  class="form-control"
                />
                <label for="anonymous">Anonymous</label>
              </div>
              <button type="submit" class="form-control btn-success">
                <template v-if="adjudicator.url"> Update adjudicator </template>
                <template v-else> Create adjudicator </template>
              </button>
            </form>
          </template>
        </TableBase>
        <TableBase
          title="Teams"
          :content="teamTable"
          :can-create="true"
          :can-edit="true"
        >
          <template #create><FormsSingleTeam /></template>
          <template #edit="{ row: { team } }">
            <form @submit.prevent="updateTeam(team)">
              <div class="form-group">
                <label for="institution">Institution</label>
                <vSelect
                  v-if="loading.institutions === false"
                  v-model="team.institution"
                  input-id="institution"
                  name="institution"
                  :options="institutions"
                  :reduce="(inst) => inst.url"
                  label="name"
                  :clearable="false"
                />
              </div>
              <div class="form-group">
                <label for="reference">Team name</label>
                <FormsFieldsTeamName
                  v-model:prefixed="team.useInstitutionPrefix"
                  v-model:name="team.reference"
                  :institution="instMap[team.institution]?.code"
                />
              </div>
              <FormsFieldsEmoji
                v-model:emoji="team.emoji"
                v-model:code="team.codeName"
              />
              <div class="form-group">
                <label for="break-categories">Break categories</label>
                <vSelect
                  v-if="loading.breakCategories === false"
                  v-model="team.breakCategories"
                  input-id="break-categories"
                  name="break-categories"
                  :options="currentTournament.breakCategories"
                  :reduce="(bc) => bc.url"
                  label="name"
                  :clearable="false"
                  multiple
                />
              </div>
              <div class="form-group">
                <label for="institution-conflicts">Institution conflicts</label>
                <vSelect
                  v-model="team.institutionConflicts"
                  input-id="institution-conflicts"
                  :loading="loading.institution"
                  name="adj-conflicts"
                  :options="institutions"
                  :reduce="(inst) => inst.url"
                  label="code"
                  :clearable="false"
                  multiple
                />
              </div>
              <button type="submit" class="form-control btn-success">
                Update team
              </button>
            </form>
          </template>
          <template #subedit="{ row: { speaker } }">
            <form>
              <div class="form-group combined">
                <div>
                  <label for="name">Name</label>
                  <input
                    id="name"
                    v-model="speaker.name"
                    name="name"
                    type="text"
                    class="form-control"
                  />
                </div>
                <FormsFieldsGender v-model="speaker.gender" />
              </div>
              <div class="form-group">
                <label for="spk-email">Email</label>
                <input
                  id="spk-email"
                  v-model="speaker.email"
                  name="spk-categories"
                  type="email"
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="spk-categories">Speaker categories</label>
                <vSelect
                  v-if="loading.speakerCategories === false"
                  v-model="speaker.categories"
                  input-id="spk-categories"
                  name="spk-categories"
                  :options="currentTournament.speakerCategories"
                  :reduce="(sc) => sc.url"
                  label="name"
                  :clearable="false"
                  multiple
                />
              </div>
              <div class="form-group">
                <input
                  id="anonymous"
                  v-model="speaker.anonymous"
                  type="checkbox"
                  name="anonymous"
                  class="form-control"
                />
                <label for="anonymous">Anonymous</label>
              </div>
              <button type="submit" class="form-control btn-success">
                Update speaker
              </button>
            </form>
          </template>
        </TableBase>
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
