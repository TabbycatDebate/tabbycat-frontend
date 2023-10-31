<script setup lang="ts">
import vSelect from 'vue-select';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';
const room = reactive({
  categories: [],
  name: null,
  priority: 100,
});

const tournamentsStore = useTournamentsStore();
tournamentsStore.getRoomCategories();

const { loading, currentTournament } = storeToRefs(tournamentsStore);

function createRoom() {
  tournamentsStore.addRoom(room);
}

function suffixes(position: string) {
  return (
    tournamentsStore.currentTournament.roomCategories
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
  <form @submit.prevent="createRoom">
    <div class="form-group">
      <label for="categories">Categories</label>
      <vSelect
        v-if="loading.roomCategories === false"
        v-model="room.categories"
        input-id="categories"
        name="categories"
        :options="currentTournament.roomCategories"
        :reduce="(rc) => rc.url"
        label="name"
        multiple
      />
    </div>
    <div class="form-group">
      <label for="name">Name</label>
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
      <label for="priority">Priority</label>
      <input
        id="priority"
        v-model="room.priority"
        type="number"
        class="form-control"
        name="priority"
      />
    </div>
    <button type="submit" class="form-control btn-success">Create room</button>
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
