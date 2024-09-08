<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const currentTournamentSlug = useState('currentTournamentSlug');
const { data: tournamentData } = await useAPI(
  'tournaments',
  {},
  { tournamentSlug: currentTournamentSlug.value },
);
const { data: roundData } = await useAPI('rounds');
const { data: teamData } = await useAPI('teams');
const { data: adjData } = await useAPI('adjudicators');
const { data: roomData } = await useAPI('rooms');

definePageMeta({
  name: 'tournament.admin.index',
});
useHead({
  title: `${tournamentData.value.shortName} | ${t('base.title.admin')} - ${t(
    'base.head',
  )}`,
});

const currentRounds = roundData.value.filter((round) =>
  tournamentData.value.currentRounds.includes(round.url),
);
const roundNames = computed(() => currentRounds.map((round) => round.name));
const shownRound = ref(currentRounds[0].name);
const items = ref([
  { label: t('nav.availabilities'), icon: 'ClipboardCheck' },
  { label: t('nav.draw'), icon: 'Component' },
  { label: t('nav.release'), icon: 'Rss' },
  { label: t('nav.results'), icon: 'Trophy' },
]);
</script>

<template>
  <LayoutsAdmin>
    <GroupButtons>
      <LinkButton
        v-if="!teamData || !adjData"
        icon="UserPlus"
        :to="{
          name: 'tournament.admin.participants',
          params: { tournamentSlug: currentTournament.slug },
        }"
      >
        Import Participants
      </LinkButton>
      <LinkButton
        v-if="!roomData"
        icon="UserPlus"
        :to="{
          name: 'tournament.admin.rooms',
          params: { tournamentSlug: currentTournament.slug },
        }"
      >
        Import Rooms
      </LinkButton>
    </GroupButtons>
    <div class="card">
      <div class="title">
        <h3>{{ shownRound }}</h3>
        <SelectButton
          v-if="roundNames.length > 1"
          v-model="shownRound"
          :options="roundNames"
          aria-labelledby="basic"
        />
      </div>
      <Stepper :model="items" class="p-steps">
        <StepList>
          <Step v-for="item in items" :key="item.label" :value="item.label">
            <div class="p-menuitem-link">
              <div class="p-steps-number">
                <Icon :type="item.icon" size="19" />
              </div>
            </div>
          </Step>
        </StepList>
      </Stepper>
    </div>
  </LayoutsAdmin>
</template>
