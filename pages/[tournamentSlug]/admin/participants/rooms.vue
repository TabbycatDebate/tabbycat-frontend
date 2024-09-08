<script setup lang="ts">
import DragSelect from 'dragselect';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const currentTournament = await useCurrentTournament();
const { data: roomData, status: roomStatus } = await useAPI('rooms');
const { data: roomCatData } = await useAPI('roomCategories');
const { data: roundData } = await useAPI('rounds');

const fetchRoundSeq = ref();
const { data: availabilityData, execute: getRoundAvailabilities } = useAPI(
  'availabilities',
  { immediate: false, watch: false },
  { roundSeq: fetchRoundSeq.value },
);

const toggleRoom = ref({ round: null, room: null });
const { execute: toggleRoomAvailability } = useAPI(
  'availabilities',
  {
    immediate: false,
    watch: false,
    method: 'patch',
    body: [toggleRoom.value.room],
  },
  { roundSeq: toggleRoom.value.round.seq },
);

definePageMeta({
  name: 'tournament.admin.rooms',
});
useHead({
  title: `${currentTournament.value.shortName} | ${t(
    'base.header.admin',
  )} - ${t('nav.rooms')}`,
});
let ds = null;

const roomCategoryMap = Object.fromEntries(
  roomCatData.value.map((rc) => [rc.url, rc]) ?? [],
);

function getRoomCategories(room: Room) {
  return room.categories.map((c) => roomCategoryMap[c]?.name).join(', ');
}

function isAvailable(room: Room, round: Round) {
  return (round.availabilities ?? []).includes(room.url);
}

function toggleAvailability(room: Room, round: Round) {
  toggleRoom.value = { round, room };
  toggleRoomAvailability();
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
  currentTournament.value.rounds ?? [],
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
function editRoom(room) {
  newRoom.value = { ...room };
  showRoomDialog.value = true;
}

onMounted(() => {
  roundData.value.forEach(async (round) => {
    fetchRoundSeq.value = round.seq;
    await getRoundAvailabilities();
  });
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

const roomTableData = computed(() =>
  roomData.value.map((room) => ({
    obj: room,
    url: room.url,
    name: room.name,
    priority: room.priority,
    categories: getRoomCategories(room),
    ...Object.fromEntries(
      Object.values(rounds)
        .map((rg) => rg.map((r) => ['R' + r.seq, isAvailable(room, r)]))
        .flat(),
    ),
  })),
);
</script>

<template>
  <LayoutsAdmin>
    <PageTitle emoji="🎪">{{ $t('rooms.title') }}</PageTitle>
    <div class="tables">
      <div class="card">
        <TableBase
          :data="roomTableData"
          :loading="roomStatus === 'pending'"
          data-key="url"
          :filter-fields="['name', 'categories']"
          :title="$t('rooms.title')"
        >
          <template #actions>
            <button
              v-tooltip="$t('tables.create')"
              class="btn info small"
              @click="createRoom"
            >
              <Icon type="PlusCircle" size="22" />
            </button>
          </template>
          <Column field="name" sortable>
            <template #header>
              <Icon v-tooltip="$t('rooms.name')" type="MapPin" size="18" />
            </template>
          </Column>
          <Column field="priority" sortable>
            <template #header>
              <Icon
                v-tooltip="$t('rooms.priority')"
                type="TrendingUp"
                size="18"
              />
            </template>
          </Column>
          <Column field="categories" sortable>
            <template #header>
              <Icon v-tooltip="$t('rooms.categories')" type="Map" size="18" />
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
        </TableBase>
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
