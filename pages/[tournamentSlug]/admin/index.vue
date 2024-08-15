<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

const tournamentsStore = useTournamentsStore();
await tournamentsStore.getRoundsForCurrentTournament();
tournamentsStore.getAdjudicators();
tournamentsStore.getTeams();
tournamentsStore.getRooms();
const { currentTournament, loading } = storeToRefs(tournamentsStore);

definePageMeta({
  name: 'tournament.admin.index',
});
useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Home`,
});

const currentRounds = tournamentsStore.currentTournament.rounds.filter(
  (round) =>
    tournamentsStore.currentTournament.currentRounds.includes(round.url),
);
const roundNames = computed(() => currentRounds.map((round) => round.name));
const shownRound = ref(currentRounds[0].name);
const shownRoundSeq = computed(() =>
  currentRounds.find((round) => round.name === shownRound),
);
const items = ref([
  { label: 'Availabilities', icon: 'ClipboardCheck' },
  { label: 'Draw', icon: 'Component' },
  { label: 'Release', icon: 'Rss' },
  { label: 'Results', icon: 'Trophy' },
]);
</script>

<template>
  <LayoutsAdmin>
    <ButtonGroup>
      <LinkButton
        v-if="!currentTournament.teams || !currentTournament.adjudicators"
        icon="UserPlus"
        :to="{
          name: 'tournament.admin.participants',
          params: { tournamentSlug: currentTournament.slug },
        }"
      >
        Import Participants
      </LinkButton>
      <LinkButton
        v-if="!currentTournament.rooms"
        icon="UserPlus"
        :to="{
          name: 'tournament.admin.rooms',
          params: { tournamentSlug: currentTournament.slug },
        }"
      >
        Import Rooms
      </LinkButton>
    </ButtonGroup>
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
              <div class="p-steps-title">{{ item.label }}</div>
            </div>
          </Step>
        </StepList>
      </Stepper>
    </div>
  </LayoutsAdmin>
</template>
