<template>
  <div>
    <div class="py-16">
      <UContainer>
        <div class="flex flex-wrap justify-between gap-x-4">
          <div>
            <h1 class="text-xl font-semibold">Your Projects</h1>
            <span class="mt-1 block text-gray-600 dark:text-gray-300">
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
        <UCard :ui="{ body: { padding: '' } }">
          <MeTableProjects />
        </UCard>
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
