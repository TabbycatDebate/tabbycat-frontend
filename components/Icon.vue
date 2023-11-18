<script setup lang="ts">
import * as icons from 'lucide-vue-next';

interface Props {
  type: String;
  size?: Number;
  color?: String;
  strokeWidth?: Number;
  absoluteStrokeWidth?: Boolean;
  defaultClass?: String;
}
const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
  absoluteStrokeWidth: false,
  defaultClass: 'lucide-icon',
});

const iconComponent = computed(() => icons[props.type]);
</script>

<template>
  <component :is="iconComponent" v-bind="props" />
</template>
