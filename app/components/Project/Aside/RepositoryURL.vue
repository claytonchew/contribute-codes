<template>
  <div v-if="props.data.repositoryUrl">
    <span
      class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
      Repository
    </span>
    <RepositoryLink :url="props.data.repositoryUrl" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    repositoryUrl: string | null;
  };
}>();
</script>
