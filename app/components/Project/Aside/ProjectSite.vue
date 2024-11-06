<template>
  <div v-if="props.data.projectUrl">
    <span
      class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
      Project Site
    </span>
    <UButton
      :to="props.data.projectUrl"
      target="_blank"
      variant="link"
      color="black"
      :padded="false"
      size="sm">
      {{ stripURLScheme(props.data.projectUrl) }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    projectUrl: string | null;
  };
}>();
</script>
