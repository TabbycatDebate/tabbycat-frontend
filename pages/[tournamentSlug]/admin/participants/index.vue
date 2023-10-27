<script setup lang="ts">
import VueFeather from 'vue-feather';
import vSelect from 'vue-select';

import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

definePageMeta({
  name: 'tournament.admin.participants',
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getAdjudicators();
tournamentsStore.getInstitutions();
tournamentsStore.getPreferences();
tournamentsStore.getBreakCategories();
tournamentsStore.getSpeakerCategories();
const { currentTournament, loading } = storeToRefs(tournamentsStore);

useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Participants`,
});

const institutions = computed(() => [
  { name: 'No institution', url: null },
  ...tournamentsStore.institutions,
]);

const instMap = computed(() =>
  Object.fromEntries(
    tournamentsStore.institutions.map((inst) => [inst.url, inst]),
  ),
);

const bcMap = Object.fromEntries(
  tournamentsStore.currentTournament.breakCategories.map((bc) => [bc.url, bc]),
);

const scMap = Object.fromEntries(
  tournamentsStore.currentTournament.speakerCategories.map((sc) => [
    sc.url,
    sc,
  ]),
);

const teamCategories = (team) =>
  team.breakCategories.map((bc) => bcMap[bc].name).join(', ');
const speakerCategories = (speaker) =>
  speaker.categories.map((sc) => scMap[sc].name).join(', ');

const minScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences.find(
      (pref) => pref.identifier === 'feedback__adj_min_score',
    ).value,
);
const maxScore = computed(
  () =>
    tournamentsStore.currentTournament.preferences.find(
      (pref) => pref.identifier === 'feedback__adj_max_score',
    ).value,
);

const isDragging = ref(false);
const newAdj = ref(false);
const newTeam = ref(false);

const resetDragging = (event) => {
  if (!event.screenX && !event.screenY) {
    isDragging.value = false;
  }
};

const dropFile = (target) => {
  isDragging.value = false;
  target.value = null;
};
</script>

<template>
  <LayoutsAdmin>
    <div
      @drop.prevent="dropFile($event.dataTransfer)"
      @dragenter="isDragging = true"
      @dragover.prevent
      @dragleave="resetDragging($event)"
    >
      <Transition name="fade-in">
        <div v-if="isDragging" class="upload-overlay">
          <div>Drop .csv files here!</div>
        </div>
      </Transition>
      <PageTitle emoji="🚌">
        Participants
        <template #nav>
          <NuxtLink class="btn outline-primary">Speaker Categories</NuxtLink>
          <NuxtLink class="btn outline-primary">Private URLs</NuxtLink>
        </template>
      </PageTitle>

      <input
        id="file"
        type="file"
        accept="text/csv"
        multiple
        @change="dropFile($event.target)"
      />
      <label for="file" class="note"
        >Drag-and-drop CSV files to quickly import participants</label
      >
      <div class="tables">
        <div class="card">
          <div class="title">
            <h3>Adjudicators</h3>
            <VueFeather type="clipboard" size="22" />
            <VueFeather
              type="plus-circle"
              size="22"
              @click="newAdj = !newAdj"
            />
          </div>
          <table>
            <thead>
              <tr>
                <th><VueFeather v-tooltip="'Name'" type="user" size="18" /></th>
                <th>
                  <VueFeather v-tooltip="'Institution'" type="home" size="18" />
                </th>
                <th>
                  <VueFeather
                    v-tooltip="'Member of the Adjudication Core'"
                    type="user-check"
                    size="18"
                  />
                </th>
                <th>
                  <VueFeather
                    v-tooltip="'Independent Adjudicator'"
                    type="user-plus"
                    size="18"
                  />
                </th>
                <th class="actions"></th>
              </tr>
            </thead>
            <tbody v-if="loading.adjudicators === false">
              <Transition name="slide-fade">
                <tr v-if="newAdj" class="edit-row">
                  <td colspan="5">
                    <LazyFormsSingleAdjudicator />
                  </td>
                </tr>
              </Transition>
              <template
                v-for="adjudicator in currentTournament.adjudicators"
                :key="adjudicator.url"
              >
                <tr :class="{ 'is-editing': adjudicator._edit }">
                  <td>
                    <NuxtLink
                      :to="{
                        name: 'tournament.admin.participants.adjudicator',
                        params: {
                          tournamentSlug: currentTournament.slug,
                          id: adjudicator.id,
                        },
                      }"
                      :class="{ redacted: adjudicator.anonymous }"
                    >
                      {{ adjudicator.name || 'Redacted' }}
                    </NuxtLink>
                  </td>
                  <td>
                    {{ instMap[adjudicator.institution]?.code || '' }}
                  </td>
                  <td>
                    <VueFeather
                      v-if="adjudicator.adjCore"
                      type="check"
                      size="18"
                    />
                  </td>
                  <td>
                    <VueFeather
                      v-if="adjudicator.independent"
                      type="check"
                      size="18"
                    />
                  </td>
                  <td>
                    <VueFeather
                      v-tooltip="'Edit'"
                      type="edit"
                      size="18"
                      :stroke="
                        adjudicator._edit
                          ? 'var(--secondary-button-background)'
                          : 'var(--text-color)'
                      "
                      @click="adjudicator._edit = !adjudicator._edit"
                    />
                  </td>
                </tr>
                <Transition name="slide-fade">
                  <tr v-if="adjudicator._edit" class="edit-row">
                    <td colspan="5">
                      <form @submit.prevent="updateAdjudicator(adjudicator)">
                        <div class="form-group combined">
                          <div>
                            <label for="institution">Institution</label>
                            <vSelect
                              v-model="adjudicator.institution"
                              input-id="institution"
                              :loading="loading.institutions"
                              name="institution"
                              :options="institutions"
                              :reduce="(inst) => inst.url"
                              label="name"
                              :clearable="false"
                            />
                          </div>
                          <div>
                            <label
                              v-tooltip="'Independent Adjudicator'"
                              for="independent"
                            >
                              IA
                            </label>
                            <input
                              id="independent"
                              v-model="adjudicator.independent"
                              type="checkbox"
                              class="form-control"
                              name="independent"
                            />
                          </div>
                        </div>
                        <div class="form-group combined">
                          <div>
                            <label for="name">Name</label>
                            <input
                              id="name"
                              v-model="adjudicator.name"
                              name="name"
                              type="text"
                              class="form-control"
                            />
                          </div>
                          <FormsFieldsGender v-model="adjudicator.gender" />
                        </div>
                        <div class="form-group">
                          <label for="email">Email</label>
                          <input
                            id="email"
                            v-model="adjudicator.email"
                            name="email"
                            type="email"
                            class="form-control"
                          />
                        </div>
                        <div class="form-group">
                          <label for="score">Base score</label>
                          <input
                            id="score"
                            v-model="adjudicator.baseScore"
                            name="score"
                            type="number"
                            class="form-control"
                            :min="minScore"
                            :max="maxScore"
                            step="any"
                          />
                        </div>
                        <div class="form-group">
                          <label for="adj-conflicts"
                            >Adjudicator conflicts</label
                          >
                          <vSelect
                            v-model="adjudicator.adjudicatorConflicts"
                            input-id="adj-conflicts"
                            :loading="loading.adjudicators"
                            name="adj-conflicts"
                            :options="currentTournament.adjudicators"
                            :reduce="(adj) => adj.url"
                            label="name"
                            :clearable="false"
                            multiple
                          />
                        </div>
                        <div class="form-group">
                          <label for="team-conflicts">Team conflicts</label>
                          <vSelect
                            v-model="adjudicator.teamConflicts"
                            input-id="team-conflicts"
                            :loading="loading.teams"
                            name="team-conflicts"
                            :options="currentTournament.teams"
                            :reduce="(team) => team.url"
                            label="shortName"
                            :clearable="false"
                            multiple
                          />
                        </div>
                        <div class="form-group">
                          <label for="institution-conflicts"
                            >Institution conflicts</label
                          >
                          <vSelect
                            v-model="adjudicator.institutionConflicts"
                            input-id="institution-conflicts"
                            :loading="loading.institutions"
                            name="institution-conflicts"
                            :options="institutions"
                            :reduce="(inst) => inst.url"
                            label="code"
                            :clearable="false"
                            multiple
                          />
                        </div>
                        <div class="form-group">
                          <input
                            id="adjCore"
                            v-model="adjudicator.adjCore"
                            type="checkbox"
                            name="adjCore"
                            class="form-control"
                          />
                          <label for="adjCore"
                            >Member of the Adjudication Core</label
                          >
                        </div>
                        <div class="form-group">
                          <input
                            id="trainee"
                            v-model="adjudicator.trainee"
                            type="checkbox"
                            name="trainee"
                            class="form-control"
                          />
                          <label for="trainee"
                            >Always allocate as trainee</label
                          >
                        </div>
                        <div class="form-group">
                          <input
                            id="anonymous"
                            v-model="adjudicator.anonymous"
                            type="checkbox"
                            name="anonymous"
                            class="form-control"
                          />
                          <label for="anonymous">Anonymous</label>
                        </div>
                        <button type="submit" class="form-control btn-success">
                          <template v-if="adjudicator.url">
                            Update adjudicator
                          </template>
                          <template v-else> Create adjudicator </template>
                        </button>
                      </form>
                    </td>
                  </tr>
                </Transition>
              </template>
            </tbody>
          </table>
        </div>
        <div class="card">
          <div class="title">
            <h3>Teams</h3>
            <VueFeather type="clipboard" size="22" />
            <VueFeather
              type="plus-circle"
              size="22"
              @click="newTeam = !newTeam"
            />
          </div>
          <table>
            <thead>
              <tr>
                <th><VueFeather v-tooltip="'Name'" type="user" size="18" /></th>
                <th>
                  <VueFeather
                    v-tooltip="'Categories'"
                    type="user-check"
                    size="18"
                  />
                </th>
                <th>
                  <VueFeather v-tooltip="'Institution'" type="home" size="18" />
                </th>
                <th class="actions"></th>
              </tr>
            </thead>
            <tbody>
              <Transition name="slide-fade">
                <tr v-if="newTeam" class="edit-row">
                  <td colspan="5">
                    <FormsSingleTeam />
                  </td>
                </tr>
              </Transition>
              <template v-for="team in currentTournament.teams" :key="team.url">
                <tr class="team-row" :class="{ 'is-editing': team._edit }">
                  <td>
                    <NuxtLink
                      :to="{
                        name: 'tournament.admin.participants.team',
                        params: {
                          tournamentSlug: currentTournament.slug,
                          id: team.id,
                        },
                      }"
                    >
                      <span class="emoji">{{ team.emoji }}</span>
                      {{ team.shortName }}
                    </NuxtLink>
                  </td>
                  <td>{{ teamCategories(team) }}</td>
                  <td>
                    {{ instMap[team.institution]?.code || '' }}
                  </td>
                  <td>
                    <VueFeather
                      v-tooltip="'Edit'"
                      type="edit"
                      size="18"
                      :stroke="
                        team._edit
                          ? 'var(--secondary-button-background)'
                          : 'var(--text-color)'
                      "
                      @click="team._edit = !team._edit"
                    />
                  </td>
                </tr>
                <Transition name="slide-fade">
                  <tr v-if="team._edit" class="edit-row">
                    <td colspan="5">
                      <form @submit.prevent="updateTeam(team)">
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
                            :institution="instMap[team.institution]?.code"
                          />
                        </div>
                        <FormsFieldsEmoji
                          v-model:emoji="team.emoji"
                          v-model:code="team.codeName"
                        />
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
                        <div class="form-group">
                          <label for="institution-conflicts"
                            >Institution conflicts</label
                          >
                          <vSelect
                            v-model="team.institutionConflicts"
                            input-id="institution-conflicts"
                            :loading="loading.institution"
                            name="adj-conflicts"
                            :options="institutions"
                            :reduce="(inst) => inst.url"
                            label="code"
                            :clearable="false"
                            multiple
                          />
                        </div>
                        <button type="submit" class="form-control btn-success">
                          Update team
                        </button>
                      </form>
                    </td>
                  </tr>
                </Transition>
                <template v-for="speaker in team.speakers" :key="speaker.url">
                  <tr
                    class="speaker-row"
                    :class="{ 'is-editing': speaker._edit }"
                  >
                    <td :class="{ redacted: speaker.anonymous }">
                      <span>{{ speaker.name }}</span>
                    </td>
                    <td>{{ speakerCategories(speaker) }}</td>
                    <td></td>
                    <td>
                      <VueFeather
                        v-tooltip="'Edit'"
                        type="edit"
                        size="18"
                        :stroke="
                          speaker._edit
                            ? 'var(--secondary-button-background)'
                            : 'var(--text-color)'
                        "
                        @click="speaker._edit = !speaker._edit"
                      />
                    </td>
                  </tr>
                  <Transition name="slide-fade">
                    <tr v-if="speaker._edit" class="edit-row">
                      <td colspan="4">
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
                        <div class="form-group">
                          <input
                            id="anonymous"
                            v-model="speaker.anonymous"
                            type="checkbox"
                            name="anonymous"
                            class="form-control"
                          />
                          <label for="anonymous">Anonymous</label>
                        </div>
                        <button type="submit" class="form-control btn-success">
                          Update speaker
                        </button>
                      </td>
                    </tr>
                  </Transition>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </LayoutsAdmin>
</template>

<style lang="postcss" scoped>
.tables {
  display: flex;

  .card {
    width: 100%;
  }

  table {
    width: 100%;

    tr {
      &.speaker-row > td:first-child {
        padding-left: 1.5rem;
      }
      td,
      th {
        padding: 8px 8px 8px 4px;
        vertical-align: middle;
      }
    }
    thead {
      border-bottom: 2px solid var(--border-color);
      position: sticky;
      background: var(--background-inset-color);
      inset-block-start: 0;
      text-align: left;
    }

    tbody {
      font-size: 0.875rem;
      line-height: 1.375;

      tr {
        &.edit-row {
          line-height: 1;
          font-size: 1rem;
        }
        &:hover:not(.edit-row) {
          transition: background-color 0.2s ease;
          background-color: var(--active-background);
        }

        &:not(:last-child, .is-editing) {
          border-bottom: 1px solid var(--border-color);
        }
      }
    }
  }
}

.team-row {
  font-weight: 650;
}

.redacted {
  text-decoration: line-through;
}

.vue-feather {
  cursor: pointer;

  :deep(svg) {
    transition: all 0.5s ease;
  }

  &:hover :deep(svg) {
    stroke: var(--secondary-button-background);
  }
}

.actions {
  column-width: 18px;
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.3s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.upload-overlay {
  background-color: var(--background-inset-color);
  height: 100%;
  width: -moz-available;
  width: -webkit-fill-available;
  width: stretch;
  position: fixed;
  z-index: 2;
  padding: 5em;
  display: flex;
  align-items: center;

  > div {
    background-color: #f8fafc;
    width: 100%;
    height: 100%;
    border: 5px dashed var(--text-color);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

input[type='file'] {
  display: none;
}
.note {
  margin: 0.5rem;
  background: var(--background-inset-color);
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 80%;
  padding: 0.5rem;
  display: block;
  cursor: pointer;
}
</style>
