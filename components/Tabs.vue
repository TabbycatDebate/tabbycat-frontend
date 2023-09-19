<script setup lang="ts">
defineProps<{
  tabs: String[];
  modelValue: Number;
}>();
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="tabs">
    <div
      v-for="(tab, i) in tabs"
      :key="'tab-' + tab"
      :class="{ active: modelValue === i }"
      @click="$emit('update:modelValue', i)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<style type="postcss" scoped>
.tabs > div {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.375;
  color: var(--text-color);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease-in-out;
  background: var(--background-inset-color);

  & + div {
    margin-left: -1px;
  }

  &.active {
    border-bottom: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    background: var(--active-background);
  }

  &:not(.active) {
    border-top: 0;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    cursor: pointer;
  }
}
</style>
