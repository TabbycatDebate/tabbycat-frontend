<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

const { t } = useI18n();

definePageMeta({
  emoji: '👋',
  title: t('base.welcome'),
  name: 'index',
});
useHead({
  title: `Tabbycat | ${t('base.head')}`,
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
            <i18n-t keypath="base.adminLink">
              <template #tournament>
                <strong>{{ tournament.name }}</strong>
              </template>
            </i18n-t>
          </LinkButton>
          <LinkButton
            icon="Globe"
            :to="{
              name: 'tournament.public.index',
              params: { tournamentSlug: tournament.slug },
            }"
          >
            <i18n-t keypath="base.publicLink">
              <template #tournament>
                <strong>{{ tournament.name }}</strong>
              </template>
            </i18n-t>
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
