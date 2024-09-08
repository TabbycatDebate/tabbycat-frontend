<script setup lang="ts">
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';

defineOptions({
  inheritAttrs: false,
});

interface Props {
  data: object[];
  filterFields: string[];
  loading?: boolean;
  title?: string;
}
withDefaults(defineProps<Props>(), {
  title: '',
});

const table = ref();
function exportCSV(table) {
  table.exportCSV();
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
  <DataTable
    ref="table"
    v-model:filters="filters"
    :value="data"
    sort-mode="multiple"
    :loading="loading"
    :global-filter-fields="filterFields"
    v-bind="$attrs"
  >
    <template #header>
      <div class="title">
        <slot name="title">
          <h3>{{ title }}</h3>
        </slot>
        <InputText
          v-model="filters['global'].value"
          :placeholder="$t('tables.search')"
          class="searchbar"
        />
        <slot name="actions"></slot>
        <button
          v-tooltip="$t('tables.csvSave')"
          class="btn info small"
          @click="exportCSV(table)"
        >
          <Icon type="Clipboard" size="22" />
        </button>
      </div>
    </template>
    <template #empty>{{ $t('tables.empty') }}</template>
    <slot name="default"></slot>
    <template #expansion="slotProps"
      ><slot name="expansion" :data="slotProps.data"
    /></template>
  </DataTable>
</template>
