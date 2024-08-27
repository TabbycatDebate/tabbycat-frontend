<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useTournamentsStore } from '~/stores/tournaments';

const { t } = useI18n();

definePageMeta({
  name: 'tournament.public.participants',
  emoji: '🚌',
  title: 'nav.participants',
});
const tournamentsStore = useTournamentsStore();

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | ${t(
    'nav.participants',
  )}`,
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
