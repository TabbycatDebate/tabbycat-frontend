<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

definePageMeta({
  name: 'tournament.public.index',
});

const { data: tournamentData } = await useAPI(
  'tournaments',
  {},
  { tournamentSlug: useState('currentTournamentSlug').value },
);

useHead({
  title: `${tournamentData.value.shortName} | ${t('base.head')}`,
});
</script>

<template>
  <LayoutsPublic>
    <template #nav>
      <PublicNavigation />
    </template>
    <template #title>
      <PageTitle emoji="👋">
        {{ $t('base.tournamentWelcome', { tournament: tournamentData.name }) }}
      </PageTitle>
    </template>
    Yes!
  </LayoutsPublic>
</template>
