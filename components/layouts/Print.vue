<script setup lang="ts">
defineProps<{
  pages: Any[]
}>();
</script>

<template>
  <div>
    <main>
      <section v-for="page in pages" :key="page.seq">
        <slot :page="page"/>
      </section>
    </main>
    <Footer class="no-print"/>
  </div>
</template>

<style type="postcss" scoped>
@media print {
  section {
    page-break-inside: avoid;
    page-break-after: always;
    border: 0;
    background: white;
    box-shadow: none;
  }
}

@media screen {
  main {
    padding-left: 15px;
    padding-right: 15px;
  }

  section {
    box-shadow: 0 0 50px rgba(0, 0, 0, .5);
    background: white;
    min-height: 88mm;
  }
}
</style>
