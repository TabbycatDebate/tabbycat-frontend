<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  emoji: '👋',
  title: 'Welcome!',
  name: 'index',
});
useHead({
  title: 'Tabbycat | Home',
});

const tournamentsStore = useTournamentsStore();
const { getTournaments } = tournamentsStore;
getTournaments();
const { tournaments } = storeToRefs(tournamentsStore);
</script>

<template>
  <LayoutsPublic>
    <ul class="tournaments">
      <li v-for="tournament in tournaments" :key="tournament.url">
        <ButtonGroup :class="{ inactive: !tournament.active }">
          <LinkButton
            icon="Settings"
            :to="{
              name: 'tournament.admin.index',
              params: { tournamentSlug: tournament.slug },
            }"
          >
            Administrator area for <b>{{ tournament.name }}</b>
          </LinkButton>
          <LinkButton
            icon="Globe"
            :to="{
              name: 'tournament.public.index',
              params: { tournamentSlug: tournament.slug },
            }"
          >
            Public area for <b>{{ tournament.name }}</b>
          </LinkButton>
        </ButtonGroup>
      </li>
    </ul>
  </LayoutsPublic>
</template>

<style type="postcss">
.inactive {
  opacity: 50%;
}

.tournaments {
  margin: 0.5rem;
}
</style>
