<script setup lang="ts">
import vSelect from 'vue-select';

interface Props {
  initial: Team;
}
const props = withDefaults(defineProps<Props>(), {
  initial: null,
});
const emit = defineEmits(['closed']);

const { data: breakCategoryData } = await useAPI('breakCategories');
const preferences = await usePreferences();
const nSpeakers = computed(
  () => preferences.debateRules.substantiveSpeakers.value,
);

const team = reactive({
  url: props.initial?.url ?? null,
  institution: props.initial?.institution ?? null,
  codeName: props.initial?.codeName ?? null,
  emoji: props.initial?.emoji ?? null,
  speakers: [...(props.initial?.speakers ?? [])].push(
    ...Array(nSpeakers.value - (props.initial?.speakers?.length ?? 0))
      .fill()
      .map(() => ({
        name: '',
        gender: null,
        email: '',
        categories: [],
      })),
  ),
  reference: props.initial?.reference ?? '',
  useInstitutionPrefix: props.initial?.useInstitutionPrefix ?? true,
  breakCategories: [
    ...(props.initial?.breakCategories ??
      breakCategoryData.value.filter((bc) => bc.isGeneral).map((bc) => bc.url)),
  ],
  institutionConflicts: [...(props.initial?.institutionConflicts ?? [])],
});

const { data: institutionData } = await useAPI('institutions');
const { data: speakerCategoryData, status: speakerCategoryStatus } =
  useAPI('speakerCategories');
const { execute: createTeam } = useAPI('teams', {
  immediate: false,
  watch: false,
  method: 'post',
  body: team,
});
const { execute: updateTeam } = useAPI(
  'teams',
  { immediate: false, watch: false, method: 'post', body: team },
  { id: props.initial?.id },
);

const teamInstitution = computed(() =>
  institutionData.value.find((inst) => inst.url === team.institution),
);

async function postForm() {
  if (team.url) {
    await updateTeam();
  } else {
    await createTeam();
  }
  emit('closed', true);
}
</script>

<template>
  <form @submit.prevent="postForm">
    <div class="form-group">
      <label for="institution">{{ $t('teams.institution') }}</label>
      <FormsFieldsInstitution v-model="team.institution" name="institution" />
    </div>
    <div class="form-group">
      <label for="reference">{{ $t('teams.name') }}</label>
      <FormsFieldsTeamName
        v-model:prefixed="team.useInstitutionPrefix"
        v-model:name="team.reference"
        :institution="teamInstitution?.code"
      />
    </div>
    <FormsFieldsEmoji v-model:emoji="team.emoji" v-model:code="team.codeName" />
    <div class="form-group">
      <label for="break-categories">{{ $t('teams.breakCategories') }}</label>
      <vSelect
        v-model="team.breakCategories"
        input-id="break-categories"
        name="break-categories"
        :options="breakCategoryData"
        :reduce="(bc) => bc.url"
        label="name"
        :clearable="false"
        multiple
      />
    </div>
    <template v-if="team.speakers !== null">
      <div class="section-label">{{ $t('teams.speakers') }}</div>
      <Tabs>
        <TabList>
          <Tab
            v-for="(speaker, i) in team.speakers"
            :key="speaker.url"
            :value="i"
          >
            {{ $t('teams.speakerN', { seq: i + 1 }) }}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel
            v-for="(speaker, i) in team.speakers"
            :key="speaker.url"
            :value="i"
          >
            <div class="form-group combined">
              <div>
                <label for="name">{{ $t('people.name') }}</label>
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
              <label for="spk-email">{{ $t('people.email') }}</label>
              <input
                id="spk-email"
                v-model="speaker.email"
                name="spk-categories"
                type="email"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="spk-categories">{{
                $t('people.speakers.speakerCategories')
              }}</label>
              <vSelect
                v-if="speakerCategoryStatus === 'success'"
                v-model="speaker.categories"
                input-id="spk-categories"
                name="spk-categories"
                :options="speakerCategoryData"
                :reduce="(sc) => sc.url"
                label="name"
                :clearable="false"
                multiple
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>
    <button type="submit" class="form-control btn-success">
      <template v-if="team.url">
        {{ $t('teams.update') }}
      </template>
      <template v-else>
        {{ $t('teams.create') }}
      </template>
    </button>
  </form>
</template>
