<script setup lang="ts">
defineProps<{
  modelValue: String;
}>();
defineEmits(['update:model-value']);
const options = [
  { code: '', label: '(none)' },
  { code: 'M', label: 'Male' },
  { code: 'F', label: 'Female' },
  { code: 'O', label: 'Other' },
];
</script>

<template>
  <div class="gender-field">
    <label for="gender">Gender</label>
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
