<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import vSelect from 'vue-select';

const { t } = useI18n();

interface Props {
  modelValue: Team;
  name: string;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
});
const emit = defineEmits(['update:modelValue']);

const { data: institutionData, status } = await useAPI('institutions');
const institutions = computed(() => [
  { name: t('institutions.none'), url: null },
  ...institutionData.value,
]);

const institution = computed({
  get() {
    return institutionData.value.find((inst) => inst.url === props.modelValue);
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
</script>

<template>
  <vSelect
    v-if="status === 'success'"
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
        {{ $t('institutions.create') }}
      </button>
    </template>
  </vSelect>
  <Dialog
    v-model:visible="creatingInstitution"
    :style="{ width: '450px' }"
    :modal="true"
    :header="$t('institutions.create')"
  >
    <FormsSingleInstitution @institution="institutionCreated" />
  </Dialog>
</template>
