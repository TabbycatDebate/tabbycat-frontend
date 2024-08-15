<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

interface Props {
  editable: boolean;
}
const { editable } = withDefaults(defineProps<Props>(), {
  editable: false,
});

const tournamentsStore = useTournamentsStore();
const bcMap = ref({});
const scMap = ref({});
tournamentsStore.getTeams();
tournamentsStore.getInstitutions();
tournamentsStore.getPreferences();
tournamentsStore.getBreakCategories().then(() => {
  bcMap.value = Object.fromEntries(
    tournamentsStore.currentTournament.breakCategories?.map((bc) => [
      bc.url,
      bc,
    ]) ?? [],
  );
});
tournamentsStore.getSpeakerCategories().then(() => {
  scMap.value = Object.fromEntries(
    tournamentsStore.currentTournament.speakerCategories?.map((sc) => [
      sc.url,
      sc,
    ]) ?? [],
  );
});
const { currentTournament, loading } = storeToRefs(tournamentsStore);

const instMap = computed(() =>
  Object.fromEntries(
    tournamentsStore.institutions.map((inst) => [inst.url, inst]),
  ),
);

const useEmoji = computed(
  () => tournamentsStore.currentTournament.preferences?.ui_options?.show_emoji,
);

function getTeamName(team, admin) {
  const useCodes =
    tournamentsStore.currentTournament.preferences?.ui_options?.team_code_names
      ?.value;
  return admin && ['admin-tooltips-real', 'everywhere'].includes(useCodes)
    ? team.codeName
    : team.shortName ?? team.codeName;
}

const teamData = computed(
  () =>
    tournamentsStore.currentTournament.teams?.map((team) => ({
      obj: team,
      url: team.url,
      name: getTeamName(team, true),
      categories: team.breakCategories
        .map((bc) => bcMap.value[bc]?.name)
        .join(', '),
      institution: instMap.value[team.institution]?.code,
      speakers: team.speakers.map(({ name }) => name).join(', '),
      speakerTable: team.speakers.map((speaker) => ({
        obj: speaker,
        url: speaker.url,
        name: getPersonName(speaker),
        categories: speaker.categories
          .map((sc) => scMap.value[sc]?.name)
          .join(', '),
      })),
    })),
);

const teamExpandedRows = ref([]);
const expandAll = () => {
  teamExpandedRows.value = products.value.reduce(
    (acc, p) => (acc[p.id] = true) && acc,
    {},
  );
};
const collapseAll = () => {
  teamExpandedRows.value = null;
};

const showTeamDialog = ref(false);
const submittedTeam = ref(false);
const newTeam = ref({});
function createTeam() {
  newTeam.value = {};
  submittedTeam.value = false;
  showTeamDialog.value = true;
}
function saveTeam() {
  submittedTeam.value = true;
}
function editTeam(team) {
  newTeam.value = { ...team };
  showTeamDialog.value = true;
}
</script>

<template>
  <div class="card">
    <TableBase
      :data="teamData"
      :loading="loading.teams !== false"
      :expanded-rows="teamExpandedRows"
      :filter-fields="['name', 'categories', 'institution', 'speakers']"
      :title="$t('teams.title')"
    >
      <template #actions>
        <button
          v-if="editable"
          v-tooltip="$t('tables.create')"
          class="btn info small"
          @click="createTeam"
        >
          <Icon type="PlusCircle" size="22" />
        </button>
      </template>
      <Column expander style="width: 30px" />
      <Column field="name" sortable>
        <template #header>
          <Icon v-tooltip="$t('teams.name')" type="User" size="18" />
        </template>
        <template #body="{ data, field }">
          <VTooltip style="display: inline" theme="full-context">
            <NuxtLink
              :to="{
                name: 'tournament.admin.participants.team',
                params: {
                  tournamentSlug: currentTournament.slug,
                  id: data.obj.id,
                },
              }"
            >
              <span v-if="useEmoji" class="emoji">{{ data.obj.emoji }}</span>
              {{ data.name }}
            </NuxtLink>

            <template #popper>
              <h6>
                <span v-if="useEmoji" class="emoji">{{ data.obj.emoji }}</span>
                {{ data.obj.longName }}
              </h6>
              <hr />
              <div class="popover-content">
                {{ data.speakers }}
              </div>
            </template>
          </VTooltip>
        </template>
      </Column>
      <Column field="categories" sortable>
        <template #header>
          <Icon
            v-tooltip="$t('teams.breakCategories')"
            type="UserCheck"
            size="18"
          />
        </template>
      </Column>
      <Column field="institution" sortable>
        <template #header>
          <Icon v-tooltip="$t('institutions.title')" type="Home" size="18" />
        </template>
      </Column>
      <Column v-if="editable" :exportable="false" style="min-width: 1rem">
        <template #body="{ data }">
          <Icon
            type="Pencil"
            size="18"
            class="icon-btn"
            @click="editTeam(data.obj)"
          />
        </template>
      </Column>
      <template #expansion="slotProps">
        <DataTable
          :value="slotProps.data.speakerTable"
          data-key="url"
          class="subtable"
        >
          <Column field="name" sortable>
            <template #header>
              <Icon v-tooltip="$t('people.name')" type="User" size="18" />
            </template>
            <template #body="{ data }">
              <div :class="{ redacted: data.obj.anonymous }">
                {{ data.obj.name || $t('people.anonymous') }}
              </div>
            </template>
          </Column>
          <Column field="categories" sortable>
            <template #header>
              <Icon
                v-tooltip="'Speaker Categories'"
                type="UserCheck"
                size="18"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </TableBase>
    <Dialog
      v-model:visible="showTeamDialog"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <FormsSingleTeam :initial="newTeam" @closed="showTeamDialog = !$event" />
    </Dialog>
  </div>
</template>
