<script setup lang="ts">
interface Props {
  title: string;
  content: Object;
  initialSortBy?: Object;
}
const props = withDefaults(defineProps<Props>(), {
  initialSortBy: () => ({ index: null, asc: true }),
});

const sortBy = reactive({ ...props.initialSortBy });

const sortedRows = ref([...props.content.rows]);

async function copyTableToClipboard() {
  await navigator.clipboard.writeText(
    props.content.headers.map((h) => h.title).join('\t') +
      '\n' +
      sortedRows.value
        .map((row) => row.map((r) => r.value).join('\t'))
        .join('\n'),
  );
}

function sortIcon(index) {
  if (sortBy.index === index) {
    return sortBy.asc ? 'ArrowDownWideNarrow' : 'ArrowDownNarrowWide';
  }
  return 'ArrowUpDown';
}

function onSortClick(index) {
  if (sortBy.index === index) {
    sortedRows.value.reverse();
    sortBy.asc = !sortBy.asc;
  } else {
    sortedRows.value.sort((a, b) => -(a[index].value - b[index].value));
    sortBy.index = index;
    sortBy.asc = true;
  }
}
</script>

<template>
  <div class="card">
    <div class="title">
      <h3>{{ title }}</h3>
      <Icon
        v-tooltip="'Copy table to clipboard'"
        type="Clipboard"
        size="22"
        @click="copyTableToClipboard"
      />
    </div>
    <table>
      <thead>
        <tr>
          <th
            v-for="(header, index) in content.headers"
            :key="header.id"
            scope="col"
          >
            <Icon
              v-if="header.icon"
              v-tooltip="header.title"
              :type="header.icon"
              size="18"
            />
            <div v-else>{{ header.title }}</div>
            <Icon
              :type="sortIcon(index)"
              size="18"
              @click="onSortClick(index)"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in sortedRows" :key="row[0].value">
          <TableCell v-for="col in row" :key="col.value" v-bind="col" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
