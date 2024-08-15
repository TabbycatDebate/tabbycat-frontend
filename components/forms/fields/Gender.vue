<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps<{
  modelValue: String;
}>();
defineEmits(['update:model-value']);
const options = [
  { code: '', label: t('people.gender.none') },
  { code: 'M', label: t('people.gender.male') },
  { code: 'F', label: t('people.gender.female') },
  { code: 'O', label: t('people.gender.other') },
];
</script>

<template>
  <div class="gender-field">
    <label for="gender">{{ $t('people.gender.title') }}</label>
    <select
      id="gender"
      :value="modelValue"
      for="gender"
      class="form-control"
      @input="$emit('update:model-value', $event.target.value)"
    >
      <option v-for="g in options" :key="g.code" :value="g.code">
        {{ g.label }}
      </option>
    </select>
  </div>
</template>

<style type="postcss" scoped>
/*.gender-field {
  min-width: 100px;
}*/
</style>
