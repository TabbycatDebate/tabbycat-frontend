<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div>
    <header>
      <div class="logo">
        <img src="/logo.svg" width="33" height="33" />
        Tabbycat
      </div>
      <nav>
        <ul>
          <slot name="nav" />
        </ul>
        <ul>
          <li>
            <a href="/accounts/logout/">Log Out (admin)</a>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <div class="title">
        <slot name="title">
          <PageTitle :emoji="route.meta.emoji">
            {{ route.meta.title }}
          </PageTitle>
        </slot>
      </div>
      <slot />
    </main>
    <footer></footer>
  </div>
</template>

<style type="postcss" scoped>
header {
  background-color: var(--background-inset-color);
  border-bottom: 1px solid var(--border-color);
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  flex-flow: row nowrap;
  justify-content: flex-start;

  .logo {
    img {
      margin-right: 0.5rem;
    }

    display: flex;
    align-items: center;
  }

  nav {
    display: flex;
    flex-basis: auto;
    flex-grow: 1;
    align-items: center;

    ul {
      display: flex;
      flex-direction: row;
      padding-left: 0;
      margin-bottom: 0;
      list-style: none;

      &:first-child {
        margin-right: auto;
      }
    }
  }
}
</style>
