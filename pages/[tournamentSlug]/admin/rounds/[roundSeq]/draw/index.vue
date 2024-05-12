<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.round.draw.edit',
});

const tournamentsStore = useTournamentsStore();
const { pageRound } = storeToRefs(tournamentsStore);

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | ${tournamentsStore.pageRound.name} - Draw`,
});
</script>

<template>
  <LayoutsAdmin>
    <div />
  </LayoutsAdmin>
</template>
