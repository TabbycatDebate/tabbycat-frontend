<script setup lang="ts">
interface Props {
  value: string;
  colspan?: Number;
}
withDefaults(defineProps<Props>(), {
  colspan: 1,
});
</script>

<template>
  <td :colspan="colspan">{{ value }}</td>
</template>
