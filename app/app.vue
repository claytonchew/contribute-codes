<template>
  <div
    class="bg-background scroll-smooth subpixel-antialiased dark:antialiased">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const color = computed(() =>
  colorMode.value === "dark" ? "#171717" : "white",
);

useHead({
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  titleTemplate: "%s - contribute.codes",
  description:
    "Start making a change by contributing to open-source or non-profit projects.",
  ogImage: "https://contribute.codes/social-card.png",
  twitterImage: "https://contribute.codes/social-card.png",
  twitterCard: "summary_large_image",
});
</script>

<style>
:root {
  --header-height: 4rem;
  --ui-background: 255 255 255;
  --ui-foreground: var(--color-gray-700);
}

.dark {
  --ui-background: var(--color-gray-900);
  --ui-foreground: var(--color-gray-200);
}

.bg-background {
  background-color: rgb(var(--ui-background));
}

.bg-background\/75 {
  background-color: rgb(var(--ui-background) / 0.75);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  transform: translateY(0.1rem);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateX(0.2rem);
}
</style>
