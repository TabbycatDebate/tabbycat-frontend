<script setup lang="ts">
import vSelect from 'vue-select';

interface Props {
  initial: Room;
}
const { initial } = withDefaults(defineProps<Props>(), {
  initial: null,
});
const emit = defineEmits(['closed']);

const room = reactive({
  url: initial?.url ?? null,
  categories: initial?.categories ?? [],
  name: initial?.name ?? null,
  priority: initial?.priority ?? 100,
});

const { data: roomCategoryData, status: roomCategoryStatus } =
  useAPI('roomCategories');
const { execute: createRoom } = useAPI('rooms', {
  immediate: false,
  watch: false,
  method: 'post',
  body: room,
});
const { execute: updateRoom } = useAPI(
  'rooms',
  { immediate: false, watch: false, method: 'patch', body: room },
  { id: initial.id },
);

async function saveRoom() {
  if (room.url) {
    await updateRoom(room);
  } else {
    await createRoom(room);
  }
  emit('closed', true);
}

function suffixes(position: string) {
  return (
    roomCategoryData.value
      ?.filter(
        (rc) =>
          room.categories.includes(rc.url) &&
          rc.displayInVenueName === position,
      )
      .map((rc) => rc.name)
      .sort(new Intl.Collator('en', { caseFirst: 'upper' }).compare)
      .join(', ') ?? ''
  );
}

const prefix = computed(() => suffixes('P'));
const suffix = computed(() => suffixes('S'));
</script>

<template>
  <form @submit.prevent="saveRoom">
    <div class="form-group">
      <label for="categories">{{ $t('rooms.categories') }}</label>
      <vSelect
        v-if="roomCategoryStatus === 'success'"
        v-model="room.categories"
        input-id="categories"
        name="categories"
        :options="roomCategoryData"
        :reduce="(rc) => rc.url"
        label="name"
        multiple
      />
    </div>
    <div class="form-group">
      <label for="name">{{ $t('rooms.name') }}</label>
      <div class="room-name">
        <div v-if="prefix">
          {{ prefix }}
        </div>
        <input
          id="name"
          v-model="room.name"
          type="text"
          :class="{ 'has-suffix': suffix }"
          class="form-control"
          name="name"
        />
        <div v-if="suffix">
          {{ suffix }}
        </div>
      </div>
    </div>
    <div class="form-group">
      <label for="priority">{{ $t('rooms.priority') }}</label>
      <input
        id="priority"
        v-model="room.priority"
        type="number"
        class="form-control"
        name="priority"
      />
    </div>
    <button type="submit" class="form-control btn-success">
      <template v-if="room.url">{{ $t('rooms.update') }}</template>
      <template v-else>{{ $t('rooms.create') }}</template>
    </button>
  </form>
</template>

<style type="postcss" scoped>
.room-name {
  display: flex;

  input.has-suffix {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right: 0;
  }

  > div {
    background-color: var(--background-inset-color);
    align-self: center;
    padding: 0.82rem 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;

    & + input {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      border-left: 0;
    }

    &:first-child {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      text-align: end;
    }

    &:last-child {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      text-align: start;
    }
  }
}
</style>
