<script setup lang="ts">
interface Props {
  editable: boolean;
}
const { editable } = withDefaults(defineProps<Props>(), {
  editable: false,
});

const { data: institutionData } = await useAPI('institutions');
const { data: adjudicatorData, status: adjStatus } =
  await useAPI('adjudicators');

const instMap = computed(() =>
  Object.fromEntries(institutionData.value.map((inst) => [inst.url, inst])),
);

const adjData = computed(
  () =>
    adjudicatorData.value.map((adj) => ({
      obj: adj,
      name: adj.name,
      institution: instMap.value[adj.institution]?.code ?? null,
      adjCore: adj.adjCore,
      independent: adj.independent,
    })) ?? [],
);

const showAdjDialog = ref(false);
const submittedAdj = ref(false);
const newAdj = ref({});
function createAdjudicator() {
  newAdj.value = {};
  submittedAdj.value = false;
  showAdjDialog.value = true;
}
function editAdj(adj) {
  newAdj.value = { ...adj };
  showAdjDialog.value = true;
}
</script>

<template>
  <div class="card">
    <TableBase
      :data="adjData"
      :loading="adjStatus === 'pending'"
      :filter-fields="['name', 'institution']"
      :title="$t('adjudicators.title')"
    >
      <template #actions>
        <button
          v-if="editable"
          v-tooltip="$t('tables.create')"
          class="btn info small"
          @click="createAdjudicator"
        >
          <Icon type="PlusCircle" size="22" />
        </button>
      </template>
      <Column field="name" sortable>
        <template #header>
          <Icon v-tooltip="$t('people.name')" type="User" size="18" />
        </template>
        <template #body="{ data }">
          <TableAdjudicatorCell :adjudicator="data.obj" />
        </template>
      </Column>
      <Column field="institution" sortable>
        <template #header>
          <Icon v-tooltip="$t('institutions.title')" type="Home" size="18" />
        </template>
      </Column>
      <Column field="adjCore" sortable>
        <template #header>
          <Icon
            v-tooltip="$t('adjudicators.adjCore')"
            type="UserCheck"
            size="18"
          />
        </template>
        <template #body="{ data, field }">
          <Icon v-if="data.obj[field]" type="Check" size="18" />
        </template>
      </Column>
      <Column field="independent" sortable>
        <template #header>
          <Icon
            v-tooltip="$t('adjudicators.independent')"
            type="UserPlus"
            size="18"
          />
        </template>
        <template #body="{ data, field }">
          <Icon v-if="data.obj[field]" type="Check" size="18" />
        </template>
      </Column>
      <Column v-if="editable" :exportable="false" style="min-width: 1rem">
        <template #body="{ data }">
          <Icon
            type="Pencil"
            size="18"
            class="icon-btn"
            @click="editAdj(data.obj)"
          />
        </template>
      </Column>
    </TableBase>

    <Dialog
      v-model:visible="showAdjDialog"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <FormsSingleAdjudicator
        :initial="newAdj"
        @closed="showAdjDialog = !$event"
      />
    </Dialog>
  </div>
</template>
