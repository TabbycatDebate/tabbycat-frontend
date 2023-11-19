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
    { content: [{ value: '1' }, { value: '2' }], key: 1 },
    { content: [{ value: '3' }, { value: '4' }], key: 2 },
  ],
};
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="👋">Hello!</PageTitle>
    <TableBase
      title="Table"
      :content="content"
      :can-edit="true"
      :can-create="true"
    >
      <template #edit="row">
        {{ row }}
      </template>
    </TableBase>
  </LayoutsAdmin>
</template>
