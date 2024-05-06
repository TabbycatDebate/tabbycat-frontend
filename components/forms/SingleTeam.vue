<script setup lang="ts">
import vSelect from 'vue-select';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

interface Props {
  initial: Team;
}
const props = withDefaults(defineProps<Props>(), {
  initial: null,
});
const emit = defineEmits(['closed']);

const toCreate = !props.initial?.url;

const team = reactive({
  url: props.initial?.url ?? null,
  institution: props.initial?.institution ?? null,
  codeName: props.initial?.codeName ?? null,
  emoji: props.initial?.emoji ?? null,
  speakers: [...(props.initial?.speakers ?? [])],
  reference: props.initial?.reference ?? '',
  useInstitutionPrefix: props.initial?.useInstitutionPrefix ?? true,
  breakCategories: [...(props.initial?.breakCategories ?? [])],
  institutionConflicts: [...(props.initial?.institutionConflicts ?? [])],
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getPreferences().then(() => {
  const nSpeakers =
    tournamentsStore.currentTournament.preferences.debate_rules
      .substantive_speakers.value;
  if (!team.speakers.length) {
    team.speakers = Array(nSpeakers)
      .fill()
      .map(() => ({
        name: '',
        gender: null,
        email: '',
        categories: [],
      }));
  }
});
tournamentsStore.getInstitutions();
tournamentsStore.getBreakCategories().then(() => {
  team.breakCategories = tournamentsStore.currentTournament.breakCategories
    .filter((bc) => bc.isGeneral)
    .map((bc) => bc.url);
});
tournamentsStore.getSpeakerCategories();

const teamInstitution = computed(() =>
  tournamentsStore.institutions.find((inst) => inst.url === team.institution),
);

const { currentTournament, loading } = storeToRefs(tournamentsStore);

function createTeam() {
  if (team.url) {
    tournamentsStore.updateTeam(team);
  } else {
    tournamentsStore.addTeam(team);
  }
  emit('closed', true);
}
</script>

<template>
  <form @submit.prevent="createTeam">
    <div class="form-group">
      <label for="institution">Institution</label>
      <FormsFieldsInstitution v-model="team.institution" name="institution" />
    </div>
    <div class="form-group">
      <label for="reference">Team name</label>
      <FormsFieldsTeamName
        v-model:prefixed="team.useInstitutionPrefix"
        v-model:name="team.reference"
        :institution="teamInstitution?.code"
      />
    </div>
    <FormsFieldsEmoji v-model:emoji="team.emoji" v-model:code="team.codeName" />
    <div class="form-group">
      <label for="break-categories">Break categories</label>
      <vSelect
        v-if="loading.breakCategories === false"
        v-model="team.breakCategories"
        input-id="break-categories"
        name="break-categories"
        :options="currentTournament.breakCategories"
        :reduce="(bc) => bc.url"
        label="name"
        :clearable="false"
        multiple
      />
    </div>
    <template v-if="team.speakers !== null">
      <div class="section-label">Speakers</div>
      <TabView>
        <TabPanel
          v-for="(speaker, i) in team.speakers"
          :key="i"
          :header="'Speaker ' + (i + 1)"
        >
          <div class="form-group combined">
            <div>
              <label for="name">Name</label>
              <input
                id="name"
                v-model="speaker.name"
                name="name"
                type="text"
                class="form-control"
              />
            </div>
            <FormsFieldsGender v-model="speaker.gender" />
          </div>
          <div class="form-group">
            <label for="spk-email">Email</label>
            <input
              id="spk-email"
              v-model="speaker.email"
              name="spk-categories"
              type="email"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="spk-categories">Speaker categories</label>
            <vSelect
              v-if="loading.speakerCategories === false"
              v-model="speaker.categories"
              input-id="spk-categories"
              name="spk-categories"
              :options="currentTournament.speakerCategories"
              :reduce="(sc) => sc.url"
              label="name"
              :clearable="false"
              multiple
            />
          </div>
        </TabPanel>
      </TabView>
    </template>
    <button type="submit" class="form-control btn-success">
      {{ team.url ? 'Update' : 'Create' }} team
    </button>
  </form>
</template>
