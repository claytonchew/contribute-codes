<template>
  <div>
    <span
      class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
      Published At
    </span>
    <span class="text-sm font-medium">{{
      new Date(props.data.createdAt).toLocaleDateString("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    createdAt: string;
  };
}>();
</script>
