<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

definePageMeta({
  name: 'tournament.admin.participants.institutions',
});

const currentTournament = await useCurrentTournament();
useHead({
  title: `${currentTournament.value.shortName} | ${t('base.title.admin')} - ${t(
    'nav.institutions',
  )}`,
});

const { data: institutionData } = await useAPI('institutions');
const { data: teamData, status: teamStatus } = await useAPI('teams');
const { data: adjData, status: adjStatus } = await useAPI('adjudicators');

function getInstitutionTeams(institution) {
  return teamData.value.filter((team) => team.institution === institution.url)
    .length;
}

function getInstitutionAdjudicators(institution) {
  return adjData.value.filter((adj) => adj.institution === institution.url)
    .length;
}

const institutions = computed(() =>
  institutionData.value.map((inst) => ({
    code: inst.code,
    name: inst.name,
    region: inst.region,
    numTeams: getInstitutionTeams(inst),
    numAdjs: getInstitutionAdjudicators(inst),
  })),
);
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🏫">
      {{ $t('nav.institutions') }}
      <template #nav>
        <NuxtLink
          class="btn outline-primary"
          :to="{
            name: 'tournament.admin.participants',
            params: { tournamentSlug: currentTournament.slug },
          }"
        >
          {{ $t('nav.participants') }}
        </NuxtLink>
        <NuxtLink class="btn outline-primary">{{
          $t('nav.speakerCategories')
        }}</NuxtLink>
        <NuxtLink
          class="btn outline-primary"
          :to="{
            name: 'tournament.admin.participants.privateurls',
            params: { tournamentSlug: currentTournament.slug },
          }"
        >
          {{ $t('nav.privateURLs') }}
        </NuxtLink>
      </template>
    </PageTitle>
    <div class="tables">
      <div class="card">
        <TableBase
          :data="institutions"
          :loading="teamStatus === 'pending' || adjStatus === 'pending'"
          :filter-fields="['name', 'code', 'region']"
          :title="$t('institutions.title')"
        >
          <template #actions>
            <button
              v-tooltip="$t('tables.create')"
              class="btn info small"
              @click="isCreating = !isCreating"
            >
              <Icon type="PlusCircle" size="22" />
            </button>
          </template>
          <Column field="code" :header="$t('institutions.code')" sortable />
          <Column field="name" :header="$t('institutions.name')" sortable />
          <Column field="region" :header="$t('institutions.region')" sortable />
          <Column
            field="numTeams"
            :header="$t('institutions.numberTeams')"
            sortable
          />
          <Column
            field="numAdjs"
            :header="$t('institutions.numberAdjs')"
            sortable
          />
        </TableBase>
      </div>
    </div>
  </LayoutsAdmin>
</template>
