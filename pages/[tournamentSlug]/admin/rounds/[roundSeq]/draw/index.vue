<script setup lang="ts">
definePageMeta({
  name: 'tournament.admin.round.draw.edit',
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
