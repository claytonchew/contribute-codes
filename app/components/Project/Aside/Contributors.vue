<template>
  <div v-if="hasContributors || isOwner" class="space-y-2">
    <div class="flex justify-between">
      <span class="block text-sm font-medium"> Contributors </span>
      <UButton
        v-if="isOwner"
        icon="heroicons:pencil-square"
        label="Edit"
        variant="ghost"
        size="xs"
        square />
    </div>
    <div class="flex flex-wrap gap-2">
      <ULink v-if="isOwner">
        <UAvatar v-if="props.data.owner" alt="+" size="lg" />
      </ULink>
      <UTooltip
        v-for="contributor in props.data.contributors"
        :key="contributor.id"
        :text="contributor.name"
        :popper="{ arrow: true, placement: 'top' }">
        <UAvatar
          :src="contributor.avatar || undefined"
          :alt="contributor.name"
          size="lg" />
      </UTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    contributors: {
      avatar: string | null;
      id: string;
      name: string;
    }[];
    owner: {
      avatar: string | null;
      id: string;
      name: string;
    };
  };
}>();

const isOwner = computed(() => {
  return props.data.owner.id === useUserSession().user.value?.id;
});

const hasContributors = computed(() => {
  return (props.data?.contributors || []).length;
});
</script>
