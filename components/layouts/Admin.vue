<script setup lang="ts">
import VueFeather from 'vue-feather';

import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

const groupBy = <T,>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string,
) =>
  array.reduce(
    (acc, value, index, array) => {
      (acc[predicate(value, index, array)] ||= []).push(value);
      return acc;
    },
    {} as { [key: string]: T[] },
  );

const tournamentsStore = useTournamentsStore();
await tournamentsStore.getRoundsForCurrentTournament();
const rounds = groupBy(
  tournamentsStore.currentTournament.rounds,
  ({ breakCategory }) => breakCategory ?? '',
);
const prelimRounds = [...(rounds?.[''] ?? [])];
delete rounds[''];

const { currentTournament } = storeToRefs(tournamentsStore);

function isCurrent(round) {
  return tournamentsStore.currentTournament.currentRounds.includes(round.url);
}
function circleClass(round) {
  const current = isCurrent(round);
  return {
    completed: round.completed,
    current,
    future: !(current || round.completed),
  };
}

const breakStatus = computed(() => {
  if (prelimRounds.every((round) => round.completed)) {
    if (
      tournamentsStore.currentTournament.currentRounds.length === 0 &&
      !Object.values(rounds).some((bc) => bc.some((round) => round.completed))
    ) {
      // Generating the break; in current
      return '#4cd3e9';
    }
    // Break has been generated; in completed
    return '#26ffc3';
  }
  // Prelim aren't finished
  return '#bdc1c5';
});

const curParticipantCreationForm = ref(0);
const curRoomCreationForm = ref(0);
</script>

<template>
  <div class="admin-layout">
    <nav>
      <div class="logo">
        <img src="/logo.svg" width="33" height="33" />
        {{ currentTournament.shortName }}
      </div>
      <ul>
        <li>
          <NuxtLink
            :to="{
              name: 'tournament.admin.index',
              params: { tournamentSlug: currentTournament.slug },
            }"
          >
            <VueFeather type="monitor" size="18" />
            <div>Overview</div>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: 'tournament.new' }">
            <VueFeather type="edit-2" size="18" />
            <div>New Tournament</div>
          </NuxtLink>
        </li>
      </ul>
      <hr />
      <ul>
        <li>
          <NuxtLink>
            <VueFeather type="settings" size="18" />
            <div>Settings</div>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="{
              name: 'tournament.admin.participants',
              params: { tournamentSlug: currentTournament.slug },
            }"
          >
            <VueFeather type="users" size="18" />
            <div>Participants</div>
          </NuxtLink>
          <VDropdown class="add" placement="right-start">
            <VueFeather type="plus-circle" size="18" />
            <template #popper>
              <div class="add-form">
                <Tabs
                  v-model="curParticipantCreationForm"
                  :tabs="['Team', 'Adjudicator', 'Institution']"
                  class="form-tabs"
                />
                <LazyFormsSingleTeam v-if="curParticipantCreationForm === 0" />
                <LazyFormsSingleAdjudicator
                  v-if="curParticipantCreationForm === 1"
                />
                <LazyFormsSingleInstitution
                  v-if="curParticipantCreationForm === 2"
                />
              </div>
            </template>
          </VDropdown>
        </li>
        <li>
          <NuxtLink
            :to="{
              name: 'tournament.admin.rooms',
              params: { tournamentSlug: currentTournament.slug },
            }"
          >
            <VueFeather type="map-pin" size="18" />
            <div>Rooms</div>
          </NuxtLink>
          <VDropdown class="add" placement="right-start">
            <VueFeather type="plus-circle" size="18" />

            <template #popper>
              <div class="add-form">
                <Tabs
                  v-model="curRoomCreationForm"
                  :tabs="['Room', 'Category']"
                  class="form-tabs"
                />
                <LazyFormsSingleRoom v-if="curRoomCreationForm === 0" />
                <LazyFormsSingleRoomCategory v-if="curRoomCreationForm === 1" />
              </div>
            </template>
          </VDropdown>
        </li>
        <li>
          <NuxtLink>
            <VueFeather type="watch" size="18" />
            <div>Checkins</div>
          </NuxtLink>
          <NuxtLink class="add">
            <VueFeather type="printer" size="18" />
          </NuxtLink>
          <NuxtLink class="add">
            <VueFeather type="camera" size="18" />
          </NuxtLink>
        </li>
        <li>
          <NuxtLink>
            <VueFeather type="message-circle" size="18" />
            <div>Feedback</div>
          </NuxtLink>
          <VDropdown class="add" placement="right-start">
            <VueFeather type="plus-circle" size="18" />
            <template #popper>
              <div class="add-form"><LazyFormsSingleFeedback /></div>
            </template>
          </VDropdown>
        </li>
        <li>
          <NuxtLink>
            <VueFeather type="bar-chart-2" size="18" />
            <div>Standings</div>
          </NuxtLink>
        </li>
      </ul>
      <hr v-if="prelimRounds.length > 0" />
      <ul>
        <li v-for="round in prelimRounds" :key="round.url">
          <NuxtLink>
            <VueFeather type="circle" size="16" :class="circleClass(round)" />
            <div>{{ round.name }}</div>
          </NuxtLink>
        </li>
      </ul>
      <template v-if="Object.keys(rounds).length > 0">
        <hr />
        <ul>
          <li>
            <NuxtLink>
              <VueFeather type="target" size="16" :stroke="breakStatus" />
              <div>Breaks</div>
            </NuxtLink>
          </li>
        </ul>
        <template v-for="(value, key) in rounds" :key="key">
          <hr />
          <ul>
            <li v-for="round in value" :key="round.url">
              <NuxtLink>
                <VueFeather
                  type="circle"
                  size="16"
                  :class="circleClass(round)"
                />
                <div>{{ round.name }}</div>
              </NuxtLink>
            </li>
          </ul>
        </template>
      </template>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<style type="postcss" scoped>
.admin-layout {
  display: grid;
  grid-template-columns: min(250px, 20%) auto;
  grid-template-areas: 'nav main';
  height: 100%;

  nav {
    grid-area: nav;
    position: relative;
    height: 100%;
    width: 100%;
    padding-left: 0;
    background: #333c47;
    overflow-y: scroll;

    @media (prefers-color-scheme: dark) {
      background-color: #1a1e23;

      hr {
        border-color: #333c47;
      }
    }

    .logo {
      display: flex;
      align-items: center;
      color: #ced4da;
      padding: 1rem 0.5rem;
      font-family: 'Helvetica Neue', sans-serif;
      font-weight: bold;

      img {
        padding-right: 0.5rem;
      }
    }

    > div {
      padding: 0.5rem 0.25rem;
    }

    li {
      padding: 0.65rem 0.9rem;
      color: #ced4da;
      display: flex;
      align-items: center;

      &:has(a.router-link-active) {
        background: #282f38;
        border-color: #1e2329;
        color: white;
      }

      &:not(:first-child) {
        border-top: 1px solid rgba(0, 0, 0, 0.125);
      }

      > a,
      > i,
      > div {
        color: #ced4da;

        &.router-link-active {
          color: white;
          cursor: text;
        }
        &:hover:not(.router-link-active) {
          color: #8d65c4;
        }
      }

      > *:first-child {
        display: flex;
        flex-grow: 1;
        align-items: center;

        > i {
          align-self: center;
        }

        > div {
          padding-left: 0.5rem;
        }
      }
      .add {
        transition: all 0.2s ease;
        > i {
          display: initial;
        }
        align-self: center;
        &:not(:last-child) {
          padding-right: 0.5rem;
        }
      }
    }
  }
  main {
    grid-area: main;
  }
}

.completed {
  :deep(svg) {
    stroke: #26ffc3;
    fill: #00bf8a;
  }
}

.current {
  :deep(svg) {
    stroke: #4cd3e9;
    fill: #17a2b8;
  }
}

.future {
  :deep(svg) {
    stroke: #bdc1c5;
    fill: #868e96;
  }
}

.add-form {
  width: 400px;
  padding: 0.5rem;
  height: auto;

  .form-tabs {
    text-align: center;
  }
}
</style>