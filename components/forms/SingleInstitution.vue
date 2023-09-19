<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';

const institution = reactive({
  name: null,
  codeName: null,
  region: null,
});

const tournamentsStore = useTournamentsStore();

function createInstitution() {
  tournamentsStore.addInstitution(institution);
}
</script>

<template>
  <form @submit.prevent="createInstitution">
    <div class="form-group">
      <label for="name">Full name</label>
      <input
        id="name"
        v-model="institution.name"
        name="name"
        type="text"
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label for="code">Abbreviation</label>
      <input
        id="code"
        v-model="institution.code"
        name="code"
        type="text"
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label for="region">Region</label>
      <input
        id="region"
        v-model="institution.region"
        name="region"
        type="text"
        class="form-control"
      />
    </div>
    <button type="submit" class="form-control btn-success">
      Create institution
    </button>
  </form>
</template>
