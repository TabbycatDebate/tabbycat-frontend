<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

const { t } = useI18n();

definePageMeta({
  name: 'tournament.public.index',
});

const tournamentsStore = useTournamentsStore();
const { currentTournament } = storeToRefs(tournamentsStore);

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | ${t('base.head')}`,
});
</script>

<template>
  <LayoutsPublic>
    <template #nav>
      <PublicNavigation />
    </template>
    <template #title>
      <PageTitle emoji="👋">
        {{
          $t('base.tournamentWelcome', { tournament: currentTournament.name })
        }}!
      </PageTitle>
    </template>
    Yes!
  </LayoutsPublic>
</template>
