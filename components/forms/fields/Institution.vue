<script setup lang="ts">
import vSelect from 'vue-select';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

interface Props {
  modelValue: Team;
  name: string;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
});
const emit = defineEmits(['update:modelValue']);

const tournamentsStore = useTournamentsStore();
const institutions = computed(() => [
  { name: 'No institution', url: null },
  ...tournamentsStore.institutions,
]);

const institution = computed({
  get() {
    return tournamentsStore.institutions.find(
      (inst) => inst.url === props.modelValue,
    );
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const creatingInstitution = ref(false);
function institutionCreated(inst) {
  emit('update:modelValue', inst.url);
  creatingInstitution.value = false;
}

const { loading } = storeToRefs(tournamentsStore);
</script>

<template>
  <vSelect
    v-if="loading.institutions === false"
    v-model="institution"
    :input-id="name"
    :name="name"
    :options="institutions"
    :reduce="(inst) => inst.url"
    label="name"
    :clearable="false"
  >
    <template #list-footer>
      <button @click.prevent="creatingInstitution = true">
        Create institution
      </button>
    </template>
  </vSelect>
  <Dialog
    v-model:visible="creatingInstitution"
    :style="{ width: '450px' }"
    :modal="true"
    header="Create institution"
  >
    <FormsSingleInstitution @institution="institutionCreated" />
  </Dialog>
</template>
