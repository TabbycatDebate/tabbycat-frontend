<script setup lang="ts">
const roomCategory = reactive({
  name: null,
  description: null,
  displayInVenueName: '-',
  displayInPublicTooltip: false,
});

const { execute: createRoomCategory } = useAPI('roomCategories', {
  immediate: false,
  watch: false,
  method: 'post',
  body: roomCategory,
});

async function postForm() {
  await createRoomCategory();
}
</script>

<template>
  <form @submit.prevent="postForm">
    <div class="form-group">
      <label for="name">{{ $t('roomCategories.name') }}</label>
      <input
        id="name"
        v-model="roomCategory.priority"
        type="text"
        class="form-control"
        name="name"
      />
    </div>
    <div class="form-group">
      <label for="description">{{ $t('roomCategories.description') }}</label>
      <input
        id="description"
        v-model="roomCategory.description"
        type="text"
        class="form-control"
        name="description"
      />
    </div>
    <div class="form-group">
      <label for="display-in-name">{{
        $t('roomCategories.displayInName')
      }}</label>
      <select
        id="display-in-name"
        v-model="roomCategory.displayInVenueName"
        class="form-control"
      >
        <option value="-">{{ $t('roomCategories.doNotDisplay') }}</option>
        <option value="P">{{ $t('roomCategories.displayAsPrefix') }}</option>
        <option value="S">{{ $t('roomCategories.displayAsSuffix') }}</option>
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
      <label for="display-tooltip">{{
        $t('roomCategories.publicTooltip')
      }}</label>
    </div>
    <button type="submit" class="form-control btn-success">
      {{ $t('roomCategories.create') }}
    </button>
  </form>
</template>
