<template>
  <div v-if="hasContributors" class="space-y-3">
    <div class="flex justify-between">
      <span class="block text-sm font-medium"> Contributors </span>
    </div>
    <div class="flex flex-wrap gap-2">
      <ULink
        v-for="contributor in props.data.contributors"
        :key="contributor.id"
        :to="`https://github.com/${contributor.username}`"
        target="_blank">
        <UTooltip
          :text="contributor.username"
          :popper="{ arrow: true, placement: 'top' }">
          <UAvatar
            :src="contributor.avatar"
            :alt="contributor.username"
            size="lg" />
        </UTooltip>
      </ULink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    id: string;
    contributors: {
      id: string;
      avatar: string;
      username: string;
      contributions: number;
    }[];
    owner: {
      avatar: string | null;
      id: string;
      name: string;
    };
  };
}>();

const hasContributors = computed(() => {
  return (props.data?.contributors || []).length;
});
</script>
