<script setup lang="ts">
import vSelect from 'vue-select';
import slugify from 'slugify';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.new',
  emoji: '🏆',
  title: 'New Tournament',
});
useHead({
  title: 'Tabbycat | New Tournament',
});

const dataEntry = [
  'Disabled (tab staff only)',
  'Use private URLs',
  'Use publicly-accessible forms',
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
  '2 vs 2 Impromptu',
  '3 vs 3 Prepared',
  'American Parliamentary Debate Association',
  'Australian Easters',
  'Australs',
  'British Parliamentary',
  'Canadian Parliamentary ',
  'United Asian Debating Championships',
  'World Schools Debating Championships',
];

function createTournament() {
  tournamentsStore.createTournament(tournament);
}
</script>

<template>
  <LayoutsPublic>
    <div class="card info">
      <strong>Just trying out Tabbycat?</strong> If you're learning or playing
      around with Tabbycat, it's easiest to create a demo tournament that is
      prepopulated with a fake (but typical) set of teams, adjudicators, rooms,
      and the like. You can then delete this demo tournament later on, or deploy
      a new instance for your real tournament.
      <div class="row"></div>
    </div>
    <div class="card">
      <form @submit.prevent="createTournament">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="tournament.name"
            name="name"
            type="text"
            class="form-control"
          />
          <div class="help-text">
            The full name, e.g. "Australasian Intervarsity Debating
            Championships 2016"
          </div>
        </div>
        <div class="form-group combined equal">
          <div>
            <label for="short-name">Short name</label>
            <input
              id="short-name"
              v-model="tournament.shortName"
              name="short-name"
              type="text"
              class="form-control"
            />
            <div class="help-text">
              The name used in the menu, e.g. "Australs 2016"
            </div>
          </div>
          <div>
            <label for="slug">Slug</label>
            <input
              id="slug"
              v-model="tournament.slug"
              name="slug"
              type="text"
              class="form-control"
              pattern="^[A-Za-z0-9_\-]{1,50}$"
            />
            <div class="help-text">
              The sub-URL of the tournament, cannot have spaces, e.g.
              "australs2016"
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="format">Format</label>
          <vSelect
            v-model="tournament.format"
            input-id="format"
            name="format"
            :options="presets"
            :clearable="true"
          />
          <div class="help-text">
            Apply a standard set of settings to match a common debate format.
            These can be changed afterwards and should be checked for your
            needs.
          </div>
        </div>
        <div class="form-group combined equal">
          <div>
            <label for="prelim-rounds">Number of preliminary rounds</label>
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
            <label for="open-break"
              >Number of teams in the first open elimination round</label
            >
            <input
              id="open-break"
              v-model="tournament.openBreak"
              name="open-break"
              type="number"
              class="form-control"
              min="0"
            />
            <div class="help-text">
              Leave blank if there are no elimination rounds
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
              <label for="public">Enable public pages</label>
              <div class="help-text">
                Show non-sensitive information on the public-facing side of this
                site, like draws (once released) and the motions of previous
                rounds
              </div>
            </div>
          </div>
          <div>
            <label for="data-entry">Participant data entry</label>
            <vSelect
              v-model="tournament.dataEntry"
              input-id="data-entry"
              name="data-entry"
              :options="dataEntry"
              :clearable="false"
            />
            <div class="help-text">
              Whether participants can submit ballots and feedback themselves,
              and how they do so
            </div>
          </div>
        </div>
        <button type="submit" class="form-control btn-success">
          Create tournament
        </button>
      </form>
    </div>
  </LayoutsPublic>
</template>
