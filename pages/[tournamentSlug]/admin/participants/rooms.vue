<script setup lang="ts">
import DragSelect from 'dragselect';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';
const tournamentsStore = useTournamentsStore();
tournamentsStore.getRoomCategories();

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

const roomsTable = computed(() => ({
  headers: [
    { title: 'Name', icon: 'MapPin' },
    { title: 'Priority', icon: 'TrendingUp' },
    { title: 'Categories', icon: 'Map' },
    ...Object.values(rounds)
      .map((rg) =>
        rg.map((r, i) => ({
          title: r.abbreviation,
          customClasses: i === 0 ? ['first', 'round-col'] : ['round-col'],
        })),
      )
      .flat(),
  ],
  rows:
    tournamentsStore.currentTournament.rooms?.map((room) => ({
      content: [
        { value: room.displayName },
        { value: room.priority },
        { value: getRoomCategories(room) },
        ...Object.values(rounds)
          .map((rg) =>
            rg.map((round, i) => ({
              component: 'Checkbox',
              value: isAvailable(room, round),
              checkFunction: () => toggleAvailability(room, round),
              customClasses: i === 0 ? ['first', 'center'] : ['center'],
            })),
          )
          .flat(),
      ],
      room,
      key: room.url,
    })) ?? [],
}));
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🎪">Rooms</PageTitle>
    <div class="tables">
      <TableBase
        title="Rooms"
        :content="roomsTable"
        :can-create="true"
        :can-edit="true"
      >
        <template #create><LazyFormsSingleRoom /></template>
        <template #edit="{ row: { room } }">
          <form @submit.prevent="updateRoom(room)"></form>
        </template>
      </TableBase>
    </div>
  </LayoutsAdmin>
</template>
