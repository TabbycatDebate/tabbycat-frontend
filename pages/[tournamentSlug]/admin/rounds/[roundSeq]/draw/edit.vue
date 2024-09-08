<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import draggable from '@/vuedraggable';

const { t } = useI18n();

definePageMeta({
  name: 'tournament.admin.round.draw.edit',
});

const currentTournament = await useCurrentTournament();
const currentRound = await useCurrentRound();

const { data: drawData } = await useAPI('draw');

useHead({
  title: `${currentTournament.value.shortName} | ${
    currentRound.value.name
  } - ${t('editDraw.title')}`,
});

const drag = ref(false);
</script>

<template>
  <LayoutsAdmin>
    <template v-for="debate in drawData" :key="debate.id">
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
