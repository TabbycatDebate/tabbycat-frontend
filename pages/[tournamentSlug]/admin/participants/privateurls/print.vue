<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  name: 'tournament.admin.participants.privateurls.print',
});

const currentTournament = await useCurrentTournament();
const { data: adjData } = await useAPI('adjudicators');
const { data: instData } = await useAPI('institutions');

useHead({
  title: `${currentTournament.value.shortName} | ${t('base.title.print')} - ${t(
    'nav.privateURLs',
  )}`,
});

const insts = computed(() => Object.fromEntries(instData.value.map(inst => [inst.url, inst])));

const pages = computed(() => adjData.value.map((obj, i) => ({ seq: i, adj: obj, inst: insts.value[obj.institution] })));
</script>

<template>
  <LayoutsPrint :pages="pages" v-slot="{ page }">
    <h1><center>Private URL for {{ page.adj.name }}<template v-if="page.inst"> ({{ page.inst.code }})</template></center></h1>
  </LayoutsPrint>
</template>
