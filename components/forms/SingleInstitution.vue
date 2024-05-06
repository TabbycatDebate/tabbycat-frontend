<script setup lang="ts">
import { useTournamentsStore } from '~/stores/tournaments';

const emit = defineEmits(['institution']);
const institution = reactive({
  name: null,
  codeName: null,
  region: null,
});

const tournamentsStore = useTournamentsStore();

const saving = ref(false);
async function createInstitution() {
  saving.value = true;
  const created = await tournamentsStore.addInstitution(institution);
  emit('institution', created);
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
    <button type="submit" class="form-control btn-success" :disabled="saving">
      Create institution
    </button>
  </form>
</template>
