<script setup lang="ts">
import vSelect from 'vue-select';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

const adjudicator = reactive({
  url: null,
  institution: null,
  gender: null,
  email: '',
  adjCore: false,
  independent: false,
  trainee: false,
  baseScore: null,
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getInstitutions();
tournamentsStore.getPreferences();

const institutions = computed(() => [
  { name: 'No institution', url: null },
  ...tournamentsStore.institutions,
]);

const minScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences.find(
      (pref) => pref.identifier === 'feedback__adj_min_score',
    ).value,
);
const maxScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences.find(
      (pref) => pref.identifier === 'feedback__adj_max_score',
    ).value,
);

const { loading } = storeToRefs(tournamentsStore);

function createAdjudicator() {
  tournamentsStore.addAdjudicator(adjudicator);
}
</script>

<template>
  <form @submit.prevent="createAdjudicator">
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
        <label v-tooltip="'Independent Adjudicator'" for="independent">
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
    <button type="submit" class="form-control btn-success">
      Create adjudicator
    </button>
  </form>
</template>
