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
const { data: teamData } = await useAPI('teams');

const teams = computed(() => Object.fromEntries(teamData.value.map(team => [team.url, team])));

useHead({
  title: `${currentTournament.value.shortName} | ${
    currentRound.value.name
  } - ${t('editDraw.title')}`,
});

const debates = ref(drawData.value.map(debate => ({ ...debate, teams: ref(debate.teams) })))

const drag = ref(false);
</script>

<template>
  <LayoutsAdmin>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Teams</th>
          <th>Conf</th>
        </tr>
      </thead>
      <tbody><!--tag="transition-group" type: 'transition-group',-->
        <tr v-for="debate in debates" :key="debate.id">
          <td>{{ debate.id }}</td>
          <draggable
            v-model="debate.teams"
            tag="td" 
            :component-data="{
              tag: 'td',
              name: !drag ? 'flip-list' : null,
              style: 'display: flex',
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
            swap
          >
            <template #item="{ element }">
              <div>
                {{ teams[element.team].shortName }}
              </div>
            </template>
          </draggable>
          <td></td>
        </tr>
      </tbody>
    </table>
  </LayoutsAdmin>
</template>
