<script setup lang="ts">
defineProps<{
  emoji?: String;
}>();
</script>

<template>
  <div class="header">
    <h2>
      <span v-if="emoji" class="emoji">{{ emoji }}</span>
      <slot />
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
    margin-right: 0.5rem;
  }
}

.header {
  padding: 1rem 0.5rem;
  display: flex;
  align-items: center;

  .right {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 5px;
  }
}
</style>
