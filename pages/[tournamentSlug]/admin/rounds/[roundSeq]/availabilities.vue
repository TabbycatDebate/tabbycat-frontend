<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

definePageMeta({
  name: 'tournament.admin.round.availabilities',
});

const currentTournament = await useCurrentTournament();
const currentRound = await useCurrentRound();
const { data: teamData, status: teamStatus } = useAPI('teams');

useHead({
  title: `${currentTournament.value.shortName} | ${
    currentRound.value.name
  } - ${t('nav.availabilties')}`,
});
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="📍">
      {{ $t('nav.availabilties') }}
      <template #subtitle>{{
        $t('availabilities.subtitle', { round: currentRound.name })
      }}</template>
      <template #nav></template>
    </PageTitle>

    <Tabs>
      <TabList>
        <Tab value="Teams">{{ $t('teams.title') }}</Tab>
        <Tab value="Adjudicators">{{ $t('adjudicators.title') }}</Tab>
        <tab value="Rooms">{{ $t('rooms.title') }}</tab>
      </TabList>
      <TabPanels>
        <TabPanel value="Teams">
          <div class="card">
            <TableBase
              :value="speakerTable"
              :loading="teamStatus === 'pending'"
              :global-filter-fields="['name', 'urlKey', 'team']"
            >
            </TableBase>
          </div>
        </TabPanel>
        <TabPanel value="Adjudicators"></TabPanel>
        <TabPanel value="Rooms"></TabPanel>
      </TabPanels>
    </Tabs>
  </LayoutsAdmin>
</template>
