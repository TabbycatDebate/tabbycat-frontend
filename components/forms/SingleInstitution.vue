<script setup lang="ts">
const emit = defineEmits(['institution']);
const institution = reactive({
  name: null,
  codeName: null,
  region: null,
});

const { data, execute: createInstitution } = useAPI('institutions', {
  method: 'post',
  immediate: false,
  watch: false,
  body: institution,
});

const saving = ref(false);
async function submitInstitution() {
  saving.value = true;
  await createInstitution(institution);
  emit('institution', data.value);
}
</script>

<template>
  <form @submit.prevent="submitInstitution">
    <div class="form-group">
      <label for="name">{{ $t('institutions.fullName') }}</label>
      <input
        id="name"
        v-model="institution.name"
        name="name"
        type="text"
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label for="code">{{ $t('institutions.code') }}</label>
      <input
        id="code"
        v-model="institution.code"
        name="code"
        type="text"
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label for="region">{{ $t('institutions.region') }}</label>
      <input
        id="region"
        v-model="institution.region"
        name="region"
        type="text"
        class="form-control"
      />
    </div>
    <button type="submit" class="form-control btn-success" :disabled="saving">
      {{ $t('institutions.create') }}
    </button>
  </form>
</template>
