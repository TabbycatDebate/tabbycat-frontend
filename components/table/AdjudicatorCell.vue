<script setup lang="ts">
const currentTournament = await useCurrentTournament();

interface Props {
  adjudicator: Adjudicator;
}
const props = defineProps<Props>();

const url = computed(() => ({
  name: 'tournament.admin.participants.adjudicator',
  params: {
    tournamentSlug: currentTournament.value.slug,
    id: props.adjudicator.id,
  },
}));
</script>

<template>
  <div v-if="adjudicator.anonymous" class="redacted">
    <NuxtLink v-if="adjudicator.name" :to="url">
      {{ adjudicator.name }}
    </NuxtLink>
    <template v-else>{{ $t('people.anonymous') }}</template>
  </div>
  <NuxtLink v-else :to="url">{{ adjudicator.name }}</NuxtLink>
</template>
