<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.public.index',
});

const tournamentsStore = useTournamentsStore();
const { currentTournament } = storeToRefs(tournamentsStore);

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Home`,
});
</script>

<template>
  <LayoutsPublic>
    <template #nav>
      <PublicNavigation />
    </template>
    <template #title>
      <PageTitle emoji="👋">
        Welcome to {{ currentTournament.name }}!
      </PageTitle>
    </template>
    Yes!
  </LayoutsPublic>
</template>
