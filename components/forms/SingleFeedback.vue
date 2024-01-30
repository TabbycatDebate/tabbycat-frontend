<script setup lang="ts">
import vSelect from 'vue-select';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

const feedback = reactive({
  source: null,
  adjudicator: null,
  participantSubmitter: null,
  debate: null,
  answers: {},
  score: 0,
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getFeedbackQuestions().then(() => {
  feedback.answers = Object.fromEntries(
    tournamentsStore.currentTournament.feedbackQuestions.map((q) => [
      q.url,
      null,
    ]),
  );
});
tournamentsStore.getTeams();
tournamentsStore.getAdjudicators();

const participants = computed(() => [
  ...tournamentsStore.currentTournament.adjudicators,
  ...tournamentsStore.currentTournament.teams.map((t) => ({
    ...t,
    name: t.shortName,
  })),
]);

const answerableQuestions = computed(() => {
  const source = feedback.source.split('/');
  source.pop();
  if (source.pop() === 'adjudicators') {
    return tournamentsStore.currentTournament.feedbackQuestions.filter(
      (q) => q.fromAdj,
    );
  }
  return tournamentsStore.currentTournament.feedbackQuestions.filter(
    (q) => q.fromTeam,
  );
});

const { currentTournament, loading } = storeToRefs(tournamentsStore);

function attrsForQuestion(question) {
  switch (question.answerType) {
    case 'bc':
      return { is: 'input', type: 'checkbox' };
    case 'bs':
      return { is: 'input' };
    case 'i':
      return {
        is: 'input',
        type: 'number',
        min: question.minValue,
        max: question.maxValue,
      };
    case 'is':
      return {
        is: 'input',
        type: 'number',
        step: 0,
        min: question.minValue,
        max: question.maxValue,
      };
    case 't':
      return { is: 'input', type: 'text' };
    case 'tl':
      return { is: 'textarea' };
    case 'ss':
      return { is: 'select' };
    case 'ms':
      return { is: 'select' };
  }
}

function createFeedback() {
  tournamentsStore.addFeedback(feedback);
}
</script>

<template>
  <form @submit.prevent="createTeam">
    <div class="form-group">
      <label for="submitter">Submitter</label>
      <vSelect
        v-if="loading.adjudicators === false && loading.teams === false"
        v-model="feedback.source"
        input-id="submitter"
        name="submitter"
        :options="participants"
        :reduce="(p) => p.url"
        label="name"
        :clearable="false"
      />
    </div>
    <div class="form-group">
      <label for="target">To adjudicator</label>
      <vSelect
        v-if="loading.adjudicators === false"
        v-model="feedback.adjudicator"
        input-id="target"
        name="target"
        :options="currentTournament.adjudicators"
        :reduce="(p) => p.url"
        label="name"
        :clearable="false"
      />
    </div>
    <template v-if="feedback.source">
      <div
        v-for="question in answerableQuestions"
        :key="question.url"
        class="form-group"
      >
        <label :for="question.reference">{{ question.name }}</label>
        <component
          v-bind="attrsForQuestion(question)"
          :is="attrsForQuestion(question).is"
          :id="question.reference"
          v-model="feedback.answers[question.url]"
          :name="question.reference"
          class="form-control"
        />
      </div>
    </template>
    <button type="submit" class="form-control btn-success">
      Submit feedback
    </button>
  </form>
</template>
