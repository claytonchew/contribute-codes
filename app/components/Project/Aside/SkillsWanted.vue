<template>
  <div v-if="hasSkills || isOwner" class="space-y-2">
    <div class="flex justify-between">
      <span class="block text-sm font-medium"> Skills Wanted </span>
      <UButton
        v-if="isOwner"
        icon="heroicons:pencil-square"
        label="Edit"
        variant="ghost"
        size="xs"
        square />
    </div>
    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="skill in props.data.skills"
        :key="skill"
        color="white"
        :ui="{ rounded: 'rounded-full' }">
        {{ skill }}
      </UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    skills: string[];
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

const hasSkills = computed(() => {
  return (props.data?.skills || []).length;
});
</script>
