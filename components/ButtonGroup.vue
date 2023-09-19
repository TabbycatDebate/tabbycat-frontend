<template>
  <ul class="list-group">
    <slot />
  </ul>
</template>

<style type="postcss" scoped>
.list-group {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  border-radius: 0.25rem;

  :deep(li) {
    &:first-child {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
    }

    & + li {
      border-top-width: 0;
    }

    &:last-child {
      border-bottom-right-radius: inherit;
      border-bottom-left-radius: inherit;
    }
  }
}
</style>
