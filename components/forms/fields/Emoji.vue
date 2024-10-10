<script setup lang="ts">
import vSelect from 'vue-select';
import emojis from '~/assets/json/emoji.json';

const props = defineProps<{
  emoji: String;
  code: String;
}>();
const emit = defineEmits(['update:emoji', 'update:code']);

const newEmoji = computed({
  get() {
    return props.emoji;
  },
  set(newValue) {
    if (props.emoji === emojis.find((e) => e.name === props.code)?.emoji) {
      emit('update:code', emojis.find((e) => e.emoji === newValue)?.name);
    }
    emit('update:emoji', newValue);
  },
});
</script>

<template>
  <div class="form-group combined reversed">
    <div>
      <label for="emoji">{{ $t('teams.emoji') }}</label>
      <vSelect
        v-model="newEmoji"
        input-id="emoji"
        name="emoji"
        :options="emojis"
        label="name"
        :clearable="false"
        :reduce="(e) => e.emoji"
        :style="{ width: '100px' }"
      >
        <template #option="option">
          <span class="emoji">{{ option.emoji }}</span>
          {{ option.name }}
        </template>
        <template #selected-option="option">
          <span class="emoji">{{ option.emoji }}</span>
        </template>
      </vSelect>
    </div>
    <div>
      <label for="code-name">{{ $t('teams.codeName') }}</label>
      <input
        id="code-name"
        :value="code"
        name="code-name"
        type="text"
        class="form-control"
        @input="$emit('update:code', $event.target.value)"
      />
    </div>
  </div>
</template>
