<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  name: 'tournament.admin.round.draw',
});

const currentTournament = await useCurrentTournament();
const currentRound = await useCurrentRound();

useHead({
  title: `${currentTournament.value.shortName} | ${
    currentRound.value.name
  } - ${t('draw.title')}`,
});
</script>

<template>
  <LayoutsAdmin>
    <div />
  </LayoutsAdmin>
</template>
