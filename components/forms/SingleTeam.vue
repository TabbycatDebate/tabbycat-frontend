<script setup lang="ts">
import vSelect from 'vue-select';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

const team = reactive({
  institution: null,
  speakers: null,
  reference: '',
  useInstitutionPrefix: true,
  breakCategories: [],
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getPreferences().then(() => {
  const nSpeakers = tournamentsStore.currentTournament.preferences.find(
    (pref) => pref.identifier === 'debate_rules__substantive_speakers',
  ).value;
  team.speakers = Array(nSpeakers)
    .fill()
    .map(() => ({
      name: '',
      gender: null,
      email: '',
      categories: [],
    }));
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

const spkTabs = computed(() => team.speakers.map((_, i) => String(i + 1)));
const curSpeaker = ref(0);

function createTeam() {
  tournamentsStore.addTeam(team);
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
      <Tabs v-model="curSpeaker" :tabs="spkTabs" />
      <div class="form-group combined">
        <div>
          <label for="name">Name</label>
          <input
            id="name"
            v-model="team.speakers[curSpeaker].name"
            name="name"
            type="text"
            class="form-control"
          />
        </div>
        <FormsFieldsGender v-model="team.speakers[curSpeaker].gender" />
      </div>
      <div class="form-group">
        <label for="spk-email">Email</label>
        <input
          id="spk-email"
          v-model="team.speakers[curSpeaker].email"
          name="spk-categories"
          type="email"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="spk-categories">Speaker categories</label>
        <vSelect
          v-if="loading.speakerCategories === false"
          v-model="team.speakers[curSpeaker].categories"
          input-id="spk-categories"
          name="spk-categories"
          :options="currentTournament.speakerCategories"
          :reduce="(sc) => sc.url"
          label="name"
          :clearable="false"
          multiple
        />
      </div>
    </template>
    <button type="submit" class="form-control btn-success">Create team</button>
  </form>
</template>
