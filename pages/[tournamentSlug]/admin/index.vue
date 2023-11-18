<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';
const tournamentsStore = useTournamentsStore();

definePageMeta({
  name: 'tournament.admin.index',
});
useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Home`,
});

const content = {
  headers: [
    { id: 1, icon: 'User' },
    { id: 2, title: 'User' },
  ],
  rows: [
    [{ value: '1' }, { value: '2' }],
    [{ value: '3' }, { value: '4' }],
  ],
};
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="👋">Hello!</PageTitle>
    <TableBase title="Table" :content="content" />
  </LayoutsAdmin>
</template>
