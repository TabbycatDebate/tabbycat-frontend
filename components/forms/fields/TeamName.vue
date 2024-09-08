<script setup lang="ts">
defineProps<{
  name: String;
  prefixed: Boolean;
  institution?: String;
}>();
defineEmits(['update:name', 'update:prefixed']);
</script>

<template>
  <div class="team-name-input">
    <div
      v-if="institution"
      v-tooltip="$t('team.useInstitutionPrefix')"
      class="institution"
      :class="{ deactivated: !prefixed }"
      @click="$emit('update:prefixed', !prefixed)"
    >
      {{ institution }}
    </div>
    <input
      id="reference"
      :value="name"
      type="text"
      class="form-control"
      name="reference"
      @input="$emit('update:name', $event.target.value)"
    />
  </div>
</template>

<style type="postcss" scoped>
.team-name-input {
  display: flex;

  .institution {
    background-color: var(--background-inset-color);
    align-self: center;
    padding: 0.82rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    border-right: 0;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: end;
    cursor: pointer;
    text-wrap: nowrap;

    &.deactivated {
      background-color: gray;
    }

    & + input {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }
}
</style>
