<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';
interface Props {
  adjudicator: Adjudicator;
}
const props = defineProps<Props>();
const tournamentsStore = useTournamentsStore();

const url = computed(() => ({
  name: 'tournament.admin.participants.adjudicator',
  params: {
    tournamentSlug: tournamentsStore.currentTournament.slug,
    id: props.adjudicator.id,
  },
}));
</script>

<template>
  <div v-if="adjudicator.anonymous" class="redacted">
    <NuxtLink v-if="adjudicator.name" :to="url">{{
      adjudicator.name
    }}</NuxtLink>
    <template v-else>Anonymous</template>
  </div>
  <NuxtLink v-else :to="url">{{ adjudicator.name }}</NuxtLink>
</template>
