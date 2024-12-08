<template>
  <div>
    <div class="py-16">
      <UContainer>
        <div class="flex flex-wrap justify-between gap-x-4">
          <div>
            <h1 class="text-lg font-semibold sm:text-xl">Your Projects</h1>
            <span
              class="mt-1 block text-sm text-gray-600 sm:text-base dark:text-gray-300">
              Projects added by you are listed here.
            </span>
          </div>
          <div class="flex-shrink-0">
            <UButton
              color="black"
              label="Add your Project"
              @click="addProjectModal = true" />
          </div>
        </div>
      </UContainer>
    </div>

    <div class="pb-16">
      <UContainer>
        <MeTableProjects />
      </UContainer>
    </div>

    <UModal
      v-model="addProjectModal"
      :ui="{ width: 'w-full max-w-xl', strategy: 'override' }">
      <ModalProjectAdd
        @close="addProjectModal = false"
        @complete="onProjectAddComplete" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Your Projects",
});

const addProjectModal = ref(false);
const onProjectAddComplete = ({ id }: { id: string }) => {
  navigateTo(`/project/${id}`);
};
</script>
