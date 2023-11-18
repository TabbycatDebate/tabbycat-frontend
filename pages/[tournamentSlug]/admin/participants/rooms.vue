<script setup lang="ts">
import DragSelect from 'dragselect';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';
const tournamentsStore = useTournamentsStore();
tournamentsStore.getRoundsForCurrentTournament().then(() => {
  tournamentsStore.currentTournament.rounds.forEach((round) => {
    tournamentsStore.getRoundAvailabilities(round);
  });
});
tournamentsStore.getRooms();
tournamentsStore.getRoomCategories();

const { currentTournament, loading } = storeToRefs(tournamentsStore);
const newRoom = ref(false);

definePageMeta({
  name: 'tournament.admin.rooms',
});
useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Rooms`,
});

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

const checkboxTable = ref(null);
let ds = null;

const roomCategoryMap = Object.fromEntries(
  tournamentsStore.currentTournament.roomCategories?.map((rc) => [
    rc.url,
    rc,
  ]) ?? [],
);

function getRoomCategories(room: Room) {
  return room.categories.map((c) => roomCategoryMap[c].name).join(', ');
}

function isAvailable(room: Room, round: Round) {
  return (round.availabilities ?? []).includes(room.url);
}

function toggleAvailability(room: Room, round: Round) {
  tournamentsStore.toggleAvailable(room, round);
}

function handleSpaceKeyUp(e) {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
    const selected = checkboxTable.value.querySelectorAll(
      'input[type=checkbox].ds-selected',
    );
    const hasDeselected = checkboxTable.value.querySelectorAll(
      'input[type=checkbox]:not(:checked).ds-selected',
    );
    if (hasDeselected.length > 0) {
      hasDeselected.forEach((cb) => cb.click());
    } else {
      selected.forEach((cb) => cb.click());
    }
    if (selected.length > 0) {
      e.preventDefault();
      ds.SelectedSet.addAll(selected);
    }
  }
}

const rounds = groupBy(
  tournamentsStore.currentTournament.rounds ?? [],
  ({ breakCategory }) => breakCategory ?? '',
);

function handleSpaceKeyDown(e) {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
    const selected = checkboxTable.value.querySelectorAll(
      'input[type=checkbox].ds-selected',
    );
    if (selected.length > 0) {
      e.preventDefault();
    }
  }
}

onMounted(() => {
  ds = new DragSelect({
    selectables: document.querySelectorAll('input[type=checkbox]'),
    area: document.querySelector('tbody'),
    draggability: false,
  });
  ds.subscribe('DS:end', () => {
    document
      .querySelectorAll('input[type=checkbox].ds-hover')
      .forEach((cb) => cb.classList.remove('ds-hover'));
  });
  window.addEventListener('keyup', handleSpaceKeyUp);
  window.addEventListener('keydown', handleSpaceKeyDown);
});
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🎪">Rooms</PageTitle>
    <div class="tables">
      <div class="card">
        <div class="title">
          <h3>Rooms</h3>
          <Icon type="Clipboard" size="22" />
          <Icon type="PlusCircle" size="22" @click="newRoom = !newRoom" />
        </div>
        <table>
          <thead>
            <tr>
              <th>
                <Icon v-tooltip="'Name'" type="MapPin" size="18" />
              </th>
              <th>
                <Icon v-tooltip="'Priority'" type="TrendingUp" size="18" />
              </th>
              <th>
                <Icon v-tooltip="'Categories'" type="Map" size="18" />
              </th>
              <th class="actions"></th>
              <template v-for="(roundGroup, key) in rounds" :key="'h' + key">
                <th
                  v-for="(round, i) in roundGroup"
                  :key="round.url"
                  v-tooltip="round.name"
                  class="round-col"
                  :class="{ first: i === 0 }"
                >
                  {{ round.abbreviation }}
                </th>
              </template>
            </tr>
          </thead>
          <tbody v-if="loading.rooms === false" ref="checkboxTable">
            <Transition name="slide-fade">
              <tr v-if="newRoom" class="edit-row">
                <td colspan="5">
                  <LazyFormsSingleRoom />
                </td>
              </tr>
            </Transition>
            <template v-for="room in currentTournament.rooms" :key="room.url">
              <tr :class="{ 'is-editing': room._edit }">
                <td>
                  {{ room.displayName }}
                </td>
                <td>
                  {{ room.priority }}
                </td>
                <td>
                  {{ getRoomCategories(room) }}
                </td>
                <td>
                  <Icon
                    v-tooltip="'Edit'"
                    type="Edit"
                    size="18"
                    :stroke="
                      room._edit
                        ? 'var(--secondary-button-background)'
                        : 'var(--text-color)'
                    "
                    @click="room._edit = !room._edit"
                  />
                </td>
                <template v-for="(roundGroup, key) in rounds" :key="'r' + key">
                  <td
                    v-for="(round, i) in roundGroup"
                    :key="round.url"
                    :class="{ first: i === 0 }"
                  >
                    <input
                      type="checkbox"
                      class="form-control small center"
                      :checked="isAvailable(room, round)"
                      @input="toggleAvailability(room, round)"
                    />
                  </td>
                </template>
              </tr>
              <Transition name="slide-fade">
                <tr v-if="room._edit" class="edit-row">
                  <td colspan="5">
                    <form @submit.prevent="updateRoom(room)"></form>
                  </td>
                </tr>
              </Transition>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </LayoutsAdmin>
</template>

<style type="postcss" scoped>
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

        &.first {
          border-left: 1px solid var(--text-color);
        }
      }
    }
    thead {
      border-bottom: 2px solid var(--border-color);
      position: sticky;
      background: var(--background-inset-color);
      inset-block-start: 0;
      text-align: left;
      z-index: 2;
    }

    tbody {
      font-size: 0.875rem;

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

.round-col {
  text-align: center;
}

.center {
  margin: auto;
}
</style>
