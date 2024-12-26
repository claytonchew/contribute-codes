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
        @click="editSkillsModal = true" />
    </div>
    <div class="flex flex-wrap gap-1">
      <UButton
        v-for="skill in props.data.skills"
        :key="skill"
        color="white"
        :to="`/?skill=${skill}`"
        :ui="{ rounded: 'rounded-full' }"
        size="xs">
        {{ skill }}
      </UButton>
    </div>

    <UModal v-model="editSkillsModal">
      <ModalProjectSkillsEdit
        :initial-state="props.data"
        @close="editSkillsModal = false"
        @refresh="emits('refresh')" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    id: string;
    skills: string[];
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

const hasSkills = computed(() => {
  return (props.data?.skills || []).length;
});

const editSkillsModal = ref(false);
</script>
