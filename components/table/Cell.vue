<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';
const tournamentsStore = useTournamentsStore();
const { currentTournament } = storeToRefs(tournamentsStore);

interface Props {
  value: Any;
  colspan?: Number;
  component?: string;
  obj?: Object;
  checkFunction?: Function;
}
withDefaults(defineProps<Props>(), {
  colspan: 1,
  obj: () => ({}),
  component: null,
  checkFunction: () => {},
});
</script>

<template>
  <td v-if="component === 'Adjudicator'">
    <NuxtLink
      :to="{
        name: 'tournament.admin.participants.adjudicator',
        params: {
          tournamentSlug: currentTournament.slug,
          id: obj.id,
        },
      }"
      :class="{ redacted: obj.anonymous }"
    >
      {{ obj.name || 'Redacted' }}
    </NuxtLink>
  </td>
  <td v-else-if="component === 'Team'">
    <NuxtLink
      :to="{
        name: 'tournament.admin.participants.team',
        params: {
          tournamentSlug: currentTournament.slug,
          id: obj.id,
        },
      }"
    >
      <span class="emoji">{{ obj.emoji }}</span>
      {{ obj.shortName }}
    </NuxtLink>
  </td>
  <td v-else-if="component === 'Speaker'" :class="{ redacted: obj.anonymous }">
    {{ obj.name || 'Redacted' }}
  </td>
  <td v-else-if="component === 'Checkmark'">
    <Icon v-if="value" type="Check" size="18" />
  </td>
  <td v-else-if="component === 'Checkbox'">
    <input
      type="checkbox"
      class="form-control small center"
      :checked="value"
      @input="checkFunction"
    />
  </td>
  <td v-else :colspan="colspan">{{ value }}</td>
</template>
