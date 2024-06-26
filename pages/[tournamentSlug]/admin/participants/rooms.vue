<script setup lang="ts">
import DragSelect from 'dragselect';
import { FilterMatchMode } from 'primevue/api';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

const tournamentsStore = useTournamentsStore();
tournamentsStore.getRooms();
tournamentsStore.getRoomCategories();
const { currentTournament, loading } = storeToRefs(tournamentsStore);

definePageMeta({
  name: 'tournament.admin.rooms',
});
useHead({
  title: `${tournamentsStore.currentTournament.shortName} | Admin - Rooms`,
});
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
    const selected = document.querySelectorAll(
      'input[type=checkbox].ds-selected',
    );
    const hasDeselected = document.querySelectorAll(
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
    const selected = document.querySelectorAll(
      'input[type=checkbox].ds-selected',
    );
    if (selected.length > 0) {
      e.preventDefault();
    }
  }
}

const showRoomDialog = ref(false);
const submittedRoom = ref(false);
const newRoom = ref({});
function createRoom() {
  newRoom.value = {};
  submittedRoom.value = false;
  showRoomDialog.value = true;
}
function saveRoom() {
  submittedRoom.value = true;
}
function editRoom(room) {
  newRoom.value = { ...room };
  showRoomDialog.value = true;
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  await tournamentsStore.getRoundsForCurrentTournament().then(() => {
    tournamentsStore.currentTournament.rounds.forEach((round) => {
      tournamentsStore.getRoundAvailabilities(round);
    });
  });
  await tournamentsStore.getRooms();
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

const roomData = computed(
  () =>
    tournamentsStore.currentTournament.rooms?.map((room) => ({
      obj: room,
      url: room.url,
      name: room.name,
      priority: room.priority,
      categories: getRoomCategories(room),
      ...Object.fromEntries(
        Object.values(rounds)
          .map((rg) => rg.map((r, i) => ['R' + r.seq, isAvailable(room, r)]))
          .flat(),
      ),
    })),
);
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🎪">Rooms</PageTitle>
    <div class="tables">
      <div class="card">
        <DataTable
          ref="roomTable"
          v-model:filters="filters"
          :value="roomData"
          sort-mode="multiple"
          :loading="loading.rooms !== false"
          data-key="url"
          :global-filter-fields="['name', 'categories']"
        >
          <template #header>
            <div class="title">
              <h3>Rooms</h3>
              <input
                v-model="filters['global'].value"
                type="text"
                placeholder="Search"
                class="searchbar"
              />
              <button
                v-tooltip="'Save as CSV'"
                class="btn info small"
                @click="exportCSV(roomTable)"
              >
                <Icon type="Clipboard" size="22" />
              </button>
              <button
                v-tooltip="'Create'"
                class="btn info small"
                @click="createRoom"
              >
                <Icon type="PlusCircle" size="22" />
              </button>
            </div>
          </template>
          <template #empty>No data available.</template>
          <Column field="name" sortable>
            <template #header>
              <Icon v-tooltip="'Name'" type="MapPin" size="18" />
            </template>
          </Column>
          <Column field="priority" sortable>
            <template #header>
              <Icon v-tooltip="'Priority'" type="TrendingUp" size="18" />
            </template>
          </Column>
          <Column field="categories" sortable>
            <template #header>
              <Icon v-tooltip="'Room Categories'" type="Map" size="18" />
            </template>
          </Column>
          <Column :exportable="false" style="min-width: 1rem">
            <template #body="{ data }">
              <Icon
                type="Pencil"
                size="18"
                class="icon-btn"
                @click="editRoom(data.obj)"
              />
            </template>
          </Column>
          <template v-for="(roundCat, bc) in rounds" :key="bc">
            <Column
              v-for="(round, index) in roundCat"
              :key="round.url"
              :field="'R' + round.seq"
              sortable
              :class="{ first: index === 0 }"
            >
              <template #header>
                <div v-tooltip="round.name">{{ round.abbreviation }}</div>
              </template>
              <template #body="{ data, field }">
                <input
                  type="checkbox"
                  :checked="data[field]"
                  class="form-control small center"
                  @click="toggleAvailability(data.obj, round)"
                />
              </template>
            </Column>
          </template>
        </DataTable>
      </div>
    </div>
    <Dialog
      v-model:visible="showRoomDialog"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <FormsSingleRoom :initial="newRoom" @closed="showRoomDialog = !$event" />
    </Dialog>
  </LayoutsAdmin>
</template>
