<script setup lang="ts">
import { useSlots } from 'vue';
defineProps<{
  emoji?: String;
}>();

const slots = useSlots();
</script>

<template>
  <div class="header">
    <h2>
      <span v-if="emoji" class="emoji">{{ emoji }}</span>
      <slot />
      <span v-if="slots.subtitle" class="subtitle"
        ><slot name="subtitle"
      /></span>
    </h2>
    <div class="right">
      <slot name="nav" />
    </div>
  </div>
</template>

<style type="postcss">
h2 {
  font-size: 2rem;
  font-weight: bold;
  flex-grow: 1;

  .emoji {
    margin: 0 0.5rem;
  }

  .subtitle {
    color: var(--secondary-text-color);
  }
}

.header {
  padding: 1rem 0;
  display: flex;
  align-items: center;

  .right {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 5px;
  }
}
</style>
