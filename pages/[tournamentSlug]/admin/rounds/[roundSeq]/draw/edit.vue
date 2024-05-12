<script setup lang="ts">
import { storeToRefs } from 'pinia';
import draggable from '@/vuedraggable';

import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.round.draw.edit',
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getDraw(tournamentsStore.pageRound);
const { pageRound } = storeToRefs(tournamentsStore);

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | ${tournamentsStore.pageRound.name} - Edit Draw`,
});

const drag = ref(false);
</script>

<template>
  <LayoutsAdmin>
    <template v-for="debate in pageRound.draw" :key="debate.id">
      <draggable
        v-model="debate.teams"
        class="list-group"
        tag="transition-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
        v-bind="{
          animation: 200,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost',
        }"
        item-key="order"
        @start="drag = true"
        @end="drag = false"
      >
        <template #header>
          {{ debate.id }}
        </template>
        <template #item="{ element }">
          <li class="list-group-item">
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              aria-hidden="true"
              @click="element.fixed = !element.fixed"
            ></i>
            {{ element.team }}
          </li>
        </template>
      </draggable>
    </template>
  </LayoutsAdmin>
</template>
