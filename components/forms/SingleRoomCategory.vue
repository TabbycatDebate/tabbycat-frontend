<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';
const roomCategory = reactive({
  name: null,
  description: null,
  displayInVenueName: '-',
  displayInPublicTooltip: false,
});

const tournamentsStore = useTournamentsStore();

function createRoomCategory() {
  tournamentsStore.addRoomCategory(roomCategory);
}
</script>

<template>
  <form @submit.prevent="createRoomCategory">
    <div class="form-group">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="roomCategory.priority"
        type="text"
        class="form-control"
        name="name"
      />
    </div>
    <div class="form-group">
      <label for="description">Description</label>
      <input
        id="description"
        v-model="roomCategory.description"
        type="text"
        class="form-control"
        name="description"
      />
    </div>
    <div class="form-group">
      <label for="display-in-name">Display in room name</label>
      <select
        id="display-in-name"
        v-model="roomCategory.displayInVenueName"
        class="form-control"
      >
        <option value="-">Don't display</option>
        <option value="P">Display as prefix</option>
        <option value="S">Display as suffix</option>
      </select>
    </div>
    <div class="form-group">
      <input
        id="display-tooltip"
        v-model="roomCategory.displayInPublicTooltip"
        type="checkbox"
        class="form-control"
        name="display-tooltip"
      />
      <label for="display-tooltip">Display in public tooltip</label>
    </div>
    <button type="submit" class="form-control btn-success">
      Create room category
    </button>
  </form>
</template>
