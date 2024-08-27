<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import vSelect from 'vue-select';
import slugify from 'slugify';
import { useTournamentsStore } from '~/stores/tournaments';

const { t } = useI18n();

definePageMeta({
  name: 'tournament.new',
  emoji: '🏆',
  title: 'newTournament.title',
});
useHead({
  title: `Tabbycat | ${t('newTournament.title')}`,
});

const dataEntry = [
  t('options.presets.dataEntry.disabled'),
  t('options.presets.dataEntry.privateURLs'),
  t('options.presets.dataEntry.public'),
];

const tournament = reactive({
  name: '',
  shortName: '',
  slug: '',
  prelimRounds: 1,
  openBreak: null,
  format: null,
  public: false,
  dataEntry: dataEntry[0],
});

const tournamentsStore = useTournamentsStore();

watch(
  () => tournament.shortName,
  (to, from) => {
    if (tournament.slug === slugify(from).toLowerCase()) {
      tournament.slug = slugify(to).toLowerCase();
    }
  },
);

const presets = [
  t('options.presets.formats.2v2'),
  t('options.presets.formats.3v3'),
  t('options.presets.formats.apda'),
  t('options.presets.formats.easters'),
  t('options.presets.formats.australs'),
  t('options.presets.formats.bp'),
  t('options.presets.formats.cp'),
  t('options.presets.formats.uadc'),
  t('options.presets.formats.wsdc'),
];

function createTournament() {
  tournamentsStore.createTournament(tournament);
}
</script>

<template>
  <LayoutsPublic>
    <div class="card info">
      <i18n-t keypath="newTournament.demo.message">
        <template #tagline>
          <strong>{{ $t('newTournament.demo.tagline') }}</strong>
        </template>
      </i18n-t>
      <strong></strong>
      <div class="row"></div>
    </div>
    <div class="card">
      <form @submit.prevent="createTournament">
        <div class="form-group">
          <label for="name">{{ $t('newTournament.name.title') }}</label>
          <input
            id="name"
            v-model="tournament.name"
            name="name"
            type="text"
            class="form-control"
          />
          <div class="help-text">{{ $t('newTournament.name.help') }}</div>
        </div>
        <div class="form-group combined equal">
          <div>
            <label for="short-name">{{
              $t('newTournament.shortName.title')
            }}</label>
            <input
              id="short-name"
              v-model="tournament.shortName"
              name="short-name"
              type="text"
              class="form-control"
            />
            <div class="help-text">
              {{ $t('newTournament.shortName.help') }}
            </div>
          </div>
          <div>
            <label for="slug">{{ $t('newTournament.slug.title') }}</label>
            <input
              id="slug"
              v-model="tournament.slug"
              name="slug"
              type="text"
              class="form-control"
              pattern="^[A-Za-z0-9_\-]{1,50}$"
            />
            <div class="help-text">
              {{ $t('newTournament.slug.help') }}
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="format">{{ $t('newTournament.format.title') }}</label>
          <vSelect
            v-model="tournament.format"
            input-id="format"
            name="format"
            :options="presets"
            :clearable="true"
          />
          <div class="help-text">
            {{ $t('newTournament.format.help') }}
          </div>
        </div>
        <div class="form-group combined equal">
          <div>
            <label for="prelim-rounds">{{
              $t('newTournament.prelimRounds')
            }}</label>
            <input
              id="prelim-rounds"
              v-model="tournament.prelimRounds"
              name="prelim-rounds"
              type="number"
              class="form-control"
              min="1"
            />
          </div>
          <div>
            <label for="open-break">{{
              $t('newTournament.elimRoundsTeams.title')
            }}</label>
            <input
              id="open-break"
              v-model="tournament.openBreak"
              name="open-break"
              type="number"
              class="form-control"
              min="0"
            />
            <div class="help-text">
              {{ $t('newTournament.elimRoundsTeams.help') }}
            </div>
          </div>
        </div>
        <div class="form-group combined equal">
          <div class="side">
            <input
              id="public"
              v-model="tournament.public"
              type="checkbox"
              name="public"
              class="form-control"
            />
            <div>
              <label for="public">{{
                $t('newTournament.publicPages.title')
              }}</label>
              <div class="help-text">
                {{ $t('newTournament.publicPages.help') }}
              </div>
            </div>
          </div>
          <div>
            <label for="data-entry">{{
              $t('newTournament.dataEntry.title')
            }}</label>
            <vSelect
              v-model="tournament.dataEntry"
              input-id="data-entry"
              name="data-entry"
              :options="dataEntry"
              :clearable="false"
            />
            <div class="help-text">
              {{ $t('newTournament.dataEntry.help') }}
            </div>
          </div>
        </div>
        <button type="submit" class="form-control btn-success">
          {{ $t('tables.create') }}
        </button>
      </form>
    </div>
  </LayoutsPublic>
</template>
