<template>
  <NuxtPage />
</template>

<style type="postcss">
html,
body,
#__nuxt {
  height: 100%;
}

html {
  min-height: 100%;
  position: relative;
  background-color: var(--background-outset-color);
  line-height: 1;
  color: var(--text-color);
}

body {
  font-family: 'Inter', sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Helvetica Neue', sans-serif;
  color: var(--header-color);
}

h3 {
  font-size: 1.5rem;
  font-weight: bold;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

a {
  color: var(--link-color);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: var(--link-hover-color);
  }
}

.v-popper {
  cursor: pointer;
}

.emoji {
  font-family: 'Twemoji Mozilla', 'Apple Color Emoji', 'Segoe UI Emoji',
    'Noto Color Emoji', 'EmojiOne Color', 'Android Emoji', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-variant-emoji: emoji;
}
</style>
