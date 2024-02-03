<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';

const tournamentsStore = useTournamentsStore();

definePageMeta({
  name: 'tournament.admin.index',
});
useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Home`,
});
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="👋">Hello!</PageTitle>
  </LayoutsAdmin>
</template>
