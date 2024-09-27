<template>
  <div
    class="relative w-full min-w-0 overflow-hidden rounded-lg bg-white p-4 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
    <span class="mb-1 block text-xs text-gray-500 dark:text-gray-400">
      Signed in as
    </span>
    <div class="flex items-center gap-2">
      <UAvatar :src="user?.avatar ?? undefined" :alt="user?.name" size="sm" />
      <div class="flex flex-col">
        <span class="block truncate text-sm font-semibold">
          {{ user?.name }}
        </span>
        <span class="block text-xs text-gray-500 dark:text-gray-400">
          {{ user?.email }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
</script>
