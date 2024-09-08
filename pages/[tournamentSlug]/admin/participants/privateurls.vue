<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

definePageMeta({
  name: 'tournament.admin.participants.privateurls',
});

const currentTournament = await useCurrentTournament();

useHead({
  title: `${currentTournament.value.shortName} | ${t('base.title.admin')} - ${t(
    'nav.privateURLs',
  )}`,
});

const { data: teamData, status: teamStatus } = useAPI('teams');
const { data: adjData, status: adjStatus } = useAPI('adjudicators');

const adjTable = computed(() =>
  adjData.value.map((adj) => ({
    obj: adj,
    name: adj.name,
    urlKey: adj.urlKey,
  })),
);
const speakerTable = computed(() =>
  teamData.value
    .map((team) =>
      team.speakers.map((spk) => ({
        obj: spk,
        name: spk.name,
        urlKey: spk.urlKey,
        team: team.shortName,
      })),
    )
    .flat(),
);
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🎲">
      {{ $t('nav.privateURLs') }}
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
            name: 'tournament.admin.participants.institutions',
            params: { tournamentSlug: currentTournament.slug },
          }"
        >
          {{ $t('nav.institutions') }}
        </NuxtLink>
      </template>
    </PageTitle>

    <div class="tables">
      <div class="card">
        <TableBase
          :data="adjTable"
          :loading="adjStatus === 'pending'"
          :filter-fields="['name', 'urlKey']"
          :title="$t('adjudicators.title')"
        >
          <template #actions>
            <NuxtLink
              v-tooltip="$t('tables.print')"
              class="btn info small"
              to=""
            >
              <Icon type="Printer" size="22" />
            </NuxtLink>
          </template>
          <Column field="name" sortable>
            <template #header>
              <Icon v-tooltip="$t('people.name')" type="User" size="18" />
            </template>
            <template #body="{ data }">
              <TableAdjudicatorCell :adjudicator="data.obj" />
            </template>
          </Column>
          <Column field="urlKey" sortable style="width: 10em">
            <template #header>
              <Icon v-tooltip="t('people.key')" type="Key" size="18" />
            </template>
            <template #body="{ data }">
              <div class="url-link">{{ data.obj.urlKey }}</div>
            </template>
          </Column>
        </TableBase>
      </div>
      <div class="card">
        <TableBase
          :data="speakerTable"
          :loading="teamStatus === 'pending'"
          :filter-fields="['name', 'urlKey', 'team']"
          :title="$t('teams.speakers')"
        >
          <template #actions>
            <NuxtLink
              v-tooltip="$t('tables.print')"
              class="btn info small"
              to=""
            >
              <Icon type="Printer" size="22" />
            </NuxtLink>
          </template>
          <Column field="name" sortable>
            <template #header>
              <Icon v-tooltip="t('people.name')" type="User" size="18" />
            </template>
            <template #body="{ data }">
              <div v-if="data.obj.anonymous" class="redacted">
                {{ data.obj.name || $t('people.anonymous') }}
              </div>
              <template v-else>{{ data.obj.name }}</template>
            </template>
          </Column>
          <Column field="urlKey" sortable style="width: 10em">
            <template #header>
              <Icon v-tooltip="t('people.key')" type="Key" size="18" />
            </template>
            <template #body="{ data }">
              <div class="url-link">{{ data.obj.urlKey }}</div>
            </template>
          </Column>
        </TableBase>
      </div>
    </div>
  </LayoutsAdmin>
</template>
