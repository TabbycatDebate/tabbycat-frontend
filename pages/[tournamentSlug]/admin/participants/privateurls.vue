<script>
</script>

<template>
    <LayoutsAdmin>
      <PageTitle emoji="🎲"
        >Private URLs
        <template #nav>
          <NuxtLink class="btn outline-primary" to="./participants"
            >Participants</NuxtLink
          >
          <NuxtLink class="btn outline-primary" to="./institutions">Institution</NuxtLink>
          <NuxtLink class="btn outline-primary">Speaker Categories</NuxtLink>
        </template>
      </PageTitle>
      <div class="tables">
        <TableBase title="Institutions" :content="institutionsTable"> </TableBase>
      </div>
    </LayoutsAdmin>
  </template>