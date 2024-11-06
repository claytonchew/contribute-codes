<template>
  <div>
    <span
      class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
      Project Owner
    </span>
    <div class="flex items-center">
      <UAvatar
        :src="props.data.owner.avatar || undefined"
        :alt="props.data.owner.name"
        size="xs"
        class="mr-2" />
      <span class="text-sm font-medium">{{ props.data.owner.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    owner: {
      avatar: string | null;
      id: string;
      name: string;
    };
  };
}>();
</script>
