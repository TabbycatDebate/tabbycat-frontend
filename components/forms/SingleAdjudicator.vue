<script setup lang="ts">
import vSelect from 'vue-select';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

interface Props {
  initial: Adjudicator;
}
const { initial } = withDefaults(defineProps<Props>(), {
  initial: null,
});
const adjudicator = reactive({
  url: initial?.url ?? null,
  institution: initial?.institution ?? null,
  name: initial?.name ?? '',
  gender: initial?.gender ?? null,
  email: initial?.email ?? '',
  adjCore: initial?.adjCore ?? false,
  independent: initial?.independent ?? false,
  trainee: initial?.trainee ?? false,
  baseScore: initial?.baseScore ?? null,
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
    tournamentsStore.currentTournament.preferences.feedback.adj_min_score.value,
);
const maxScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences.feedback.adj_max_score.value,
);

const { loading } = storeToRefs(tournamentsStore);

function saveAdjudicator() {
  if (adjudicator.url) {
    tournamentsStore.updateAdjudicator(adjudicator);
  } else {
    tournamentsStore.addAdjudicator(adjudicator);
  }
}
</script>

<template>
  <form @submit.prevent="saveAdjudicator">
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
