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
        @click="editContributorsModal = true" />
    </div>
    <div class="flex flex-wrap gap-2">
      <ULink v-if="isOwner" @click="editContributorsModal = true">
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

    <UModal
      v-model="editContributorsModal"
      :ui="{ width: 'w-full max-w-xl', strategy: 'override' }">
      <ModalProjectContributorsEdit
        :id="props.data.id"
        @close="editContributorsModal = false"
        @refresh="emits('refresh')" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    id: string;
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

const emits = defineEmits<{
  refresh: [];
}>();

const isOwner = computed(() => {
  return props.data.owner.id === useUserSession().user.value?.id;
});

const hasContributors = computed(() => {
  return (props.data?.contributors || []).length;
});

const editContributorsModal = ref(false);
</script>
