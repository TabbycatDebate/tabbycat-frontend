<script setup lang="ts">
interface Props {
  title: string;
  content: Object;
  initialSortBy?: Object;
  canCreate?: Boolean;
  canEdit?: Boolean;
  loaded?: Boolean;
}
const props = withDefaults(defineProps<Props>(), {
  initialSortBy: () => ({ index: null, asc: true }),
  canCreate: false,
  canEdit: false,
  loaded: true,
});

const sortBy = reactive({ ...props.initialSortBy });
const sortedRows = ref(props.content.rows);
const isCreating = ref(false);

async function copyTableToClipboard() {
  await navigator.clipboard.writeText(
    props.content.headers.map((h) => h.title).join('\t') +
      '\n' +
      sortedRows.value
        .map((row) =>
          [
            row.content.map((r) => r.value).join('\t'),
            ...(row.content.subrows ?? []).map((sr) => sr.value).join('\t'),
          ].join('\n'),
        )
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
    sortedRows.value.sort((a, b) => {
      const x = a.content[index].sort ?? a.content[index].value;
      const y = b.content[index].sort ?? b.content[index].value;
      if (typeof x === 'string') {
        return -x.localeCompare(y);
      }
      return y - x;
    });
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
        v-if="loaded"
        v-tooltip="'Copy table to clipboard'"
        type="Clipboard"
        size="22"
        class="action"
        @click="copyTableToClipboard"
      />
      <Icon
        v-if="canCreate"
        v-tooltip="'Add to table'"
        type="PlusCircle"
        size="22"
        class="action"
        @click="isCreating = !isCreating"
      />
    </div>
    <table>
      <thead>
        <tr>
          <th
            v-for="(header, index) in content.headers"
            :key="header.title"
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
              class="action"
              @click="onSortClick(index)"
            />
          </th>
          <th v-if="canEdit"></th>
        </tr>
      </thead>
      <tbody v-if="loaded">
        <tr v-if="isCreating" class="edit-row">
          <td :colspan="content.headers.length + canEdit">
            <slot name="create" />
          </td>
        </tr>
        <template v-for="row in sortedRows" :key="row.key">
          <tr :class="{ primary: row.subrows }">
            <TableCell
              v-for="(cell, index) in row.content"
              :key="index"
              v-bind="cell"
            />
            <td v-if="canEdit" width="20px">
              <Icon
                v-tooltip="'Edit'"
                type="Edit"
                size="18"
                :stroke="
                  row._edit
                    ? 'var(--secondary-button-background)'
                    : 'var(--text-color)'
                "
                class="action"
                @click="row._edit = !row._edit"
              />
            </td>
          </tr>
          <tr v-if="row._edit">
            <td :colspan="content.headers.length + 1">
              <slot name="edit" :row="row" />
            </td>
          </tr>
          <template v-for="subrow in row.subrows" :key="subrow.key">
            <tr>
              <TableCell
                v-for="(cell, index) in subrow.content"
                :key="index"
                v-bind="cell"
              />
              <td v-if="canEdit" width="20px">
                <Icon
                  v-tooltip="'Edit'"
                  type="Edit"
                  size="18"
                  :stroke="
                    row._edit
                      ? 'var(--secondary-button-background)'
                      : 'var(--text-color)'
                  "
                  class="action"
                  @click="subrow._edit = !subrow._edit"
                />
              </td>
            </tr>
            <tr v-if="subrow._edit">
              <td :colspan="content.headers.length + 1">
                <slot name="subedit" :row="subrow" />
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style lang="postcss" scoped>
.title {
  > .action + .action {
    margin-left: 0.5rem;
  }
}

.action {
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    stroke: var(--secondary-button-background);
  }
}

.primary {
  font-weight: 600;
}
</style>
