<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

definePageMeta({
  emoji: '👋',
  title: 'base.welcome',
  name: 'index',
});
useHead({
  title: `Tabbycat | ${t('base.head')}`,
});

const { data: tournaments } = await useAPI('tournaments');
</script>

<template>
  <LayoutsPublic>
    <ul class="tournaments">
      <li v-for="tournament in tournaments" :key="tournament.url">
        <GroupButtons :class="{ inactive: !tournament.active }">
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
        </GroupButtons>
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
