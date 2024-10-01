<template>
  <div>
    <div class="py-24">
      <UContainer>
        <h1
          class="mx-auto max-w-5xl text-center text-3xl font-semibold sm:text-5xl">
          Start making a change by contributing to open-source or non-profit
          projects
        </h1>
        <span
          class="text-md mt-8 block text-center text-gray-600 sm:text-lg dark:text-gray-300">
          Find a project you'd like to get involved.
        </span>
      </UContainer>
    </div>

    <div class="py-8">
      <UContainer>
        <ProjectListing />
      </UContainer>
    </div>

    <div class="py-24">
      <UContainer class="flex flex-col">
        <h2 class="mx-auto max-w-5xl text-center text-xl font-semibold">
          Could not find a project you like?
        </h2>
        <span
          class="text-md mt-4 block text-center text-gray-600 dark:text-gray-300">
          Why not create your own?
        </span>
        <UButton
          color="black"
          label="Add your Project"
          size="lg"
          class="mx-auto mt-4" />
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Explore",
});
</script>
