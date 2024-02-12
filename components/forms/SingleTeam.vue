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

const toCreate = !props.initial?.url;

const team = reactive({
  url: props.initial?.url ?? null,
  institution: props.initial?.institution ?? null,
  speakers: [...(props.initial?.speakers ?? [])],
  reference: props.initial?.reference ?? '',
  useInstitutionPrefix: props.initial?.useInstitutionPrefix ?? true,
  breakCategories: [...(props.initial?.breakCategories ?? [])],
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

const institutions = computed(() => [
  { name: 'No institution', url: null },
  ...tournamentsStore.institutions,
]);

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
}
</script>

<template>
  <form @submit.prevent="createTeam">
    <div class="form-group">
      <label for="institution">Institution</label>
      <vSelect
        v-if="loading.institutions === false"
        v-model="team.institution"
        input-id="institution"
        name="institution"
        :options="institutions"
        :reduce="(inst) => inst.url"
        label="name"
        :clearable="false"
      />
    </div>
    <div class="form-group">
      <label for="reference">Team name</label>
      <FormsFieldsTeamName
        v-model:prefixed="team.useInstitutionPrefix"
        v-model:name="team.reference"
        :institution="teamInstitution?.code"
      />
    </div>
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
    <button type="submit" class="form-control btn-success">Create team</button>
  </form>
</template>
