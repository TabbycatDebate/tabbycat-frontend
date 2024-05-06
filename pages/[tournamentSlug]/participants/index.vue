<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.public.participants',
  emoji: '🚌',
  title: 'Participants',
});
const tournamentsStore = useTournamentsStore();

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Participants`,
});
</script>

<template>
  <LayoutsPublic>
    <div class="tables">
      <TableAdjudicators :editable="false" />
      <TableTeams :editable="false" />
    </div>
  </LayoutsPublic>
</template>
