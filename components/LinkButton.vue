<script setup lang="ts">
defineProps<{
  to: String;
  icon?: String;
}>();
</script>

<template>
  <li>
    <NuxtLink :to="to" class="link">
      <div v-if="icon" class="item-icon">
        <Icon :type="icon" size="18" class="icon" />
      </div>
      <div class="content">
        <slot />
      </div>
      <div class="chevron">
        <Icon type="ChevronRight" size="18" class="icon" />
      </div>
    </NuxtLink>
  </li>
</template>

<style type="postcss" scoped>
li {
  position: relative;
  display: block;
  background-color: var(--background-inset-color);
  border: 1px solid var(--border-color);
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--background-inset-active-color);
  }

  .link {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 100%;
    padding: 0.75rem 1.25rem;

    > div {
      flex: 0 0 auto;
      width: auto;
      max-width: 100%;

      > i {
        vertical-align: middle;
      }
    }

    .item-icon {
      padding-right: 1rem;
    }

    .content {
      padding-left: 0;
      padding-right: 0;
      flex-basis: 0;
      flex-grow: 1;
    }

    .chevron {
      padding-right: 0.25rem;
    }

    .icon {
      margin-top: -3px;
    }
  }
}
</style>
