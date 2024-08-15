<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';

interface Props {
  initial: Adjudicator;
}
const { initial } = withDefaults(defineProps<Props>(), {
  initial: null,
});
const emit = defineEmits(['closed']);

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
  institutionConflicts: [...(initial?.institutionConflicts ?? [])],
  teamConflicts: [...(initial?.teamConflicts ?? [])],
  adjudicatorConflicts: [...(initial?.adjudicatorConflicts ?? [])],
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getPreferences();

const minScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences.feedback.adj_min_score.value,
);
const maxScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences.feedback.adj_max_score.value,
);

function saveAdjudicator() {
  if (adjudicator.url) {
    tournamentsStore.updateAdjudicator(adjudicator);
  } else {
    tournamentsStore.addAdjudicator(adjudicator);
  }
  emit('closed', true);
}
</script>

<template>
  <form @submit.prevent="saveAdjudicator">
    <div class="form-group combined">
      <div>
        <label for="institution">{{ $t('institutions.title') }}</label>
        <FormsFieldsInstitution v-model="adjudicator.institution" />
      </div>
      <div>
        <label v-tooltip="$t('adjudicators.independent')" for="independent">
          {{ $t('adjudicators.independentAbbr') }}
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
        <label for="name">{{ $t('people.name') }}</label>
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
      <label for="email">{{ $t('people.email') }}</label>
      <input
        id="email"
        v-model="adjudicator.email"
        name="email"
        type="email"
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label for="score">{{ $t('adjudicators.baseScore') }}</label>
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
      <label for="adjCore">{{ $t('adjudicators.adjCore') }}</label>
    </div>
    <div class="form-group">
      <input
        id="trainee"
        v-model="adjudicator.trainee"
        type="checkbox"
        name="trainee"
        class="form-control"
      />
      <label for="trainee">{{ $t('adjudicators.trainee') }}</label>
    </div>
    <button type="submit" class="form-control btn-success">
      <template v-if="adjudicator.url">
        {{ $t('adjudicators.update') }}
      </template>
      <template v-else>
        {{ $t('adjudicators.create') }}
      </template>
    </button>
  </form>
</template>
