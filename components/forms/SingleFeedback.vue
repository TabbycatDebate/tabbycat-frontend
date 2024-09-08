<script setup lang="ts">
import vSelect from 'vue-select';

const feedback = reactive({
  source: null,
  adjudicator: null,
  participantSubmitter: null,
  debate: null,
  answers: {},
  score: 0,
});

const { data: questionData } = await useAPI('feedbackQuestions');
const { execute: createFeedback } = await useAPI('feedback', {
  method: 'post',
  immediate: false,
  watch: false,
  body: feedback,
});

const { data: teamData } = await useAPI('teams');
const { data: adjData } = await useAPI('adjudicators');

const participants = computed(() => [
  ...adjData.value,
  ...teamData.value.map((t) => ({
    ...t,
    name: t.shortName,
  })),
]);

const answerableQuestions = computed(() => {
  const source = feedback.source.split('/');
  source.pop();
  if (source.pop() === 'adjudicators') {
    return questionData.value.filter((q) => q.fromAdj);
  }
  return questionData.value.filter((q) => q.fromTeam);
});

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

async function postForm() {
  await createFeedback();
}
</script>

<template>
  <form @submit.prevent="postForm">
    <div class="form-group">
      <label for="submitter">{{ $t('feedback.submitter') }}</label>
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
      <label for="target">{{ $t('feedback.target') }}</label>
      <vSelect
        v-if="loading.adjudicators === false"
        v-model="feedback.adjudicator"
        input-id="target"
        name="target"
        :options="adjData"
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
      {{ $t('feedback.submit') }}
    </button>
  </form>
</template>
