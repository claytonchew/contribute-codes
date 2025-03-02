<template>
  <div class="space-y-8">
    <!-- toolbar -->
    <div class="flex w-full justify-between gap-2">
      <!-- left -->
      <div class="flex flex-wrap items-center gap-2">
        <USelectMenu
          v-model="selectedSkill"
          :options="skills"
          searchable
          placeholder="Skill"
          color="white"
          :loading="skillIsLoading"
          :ui-menu="{
            container: 'min-w-fit',
            popper: { placement: 'bottom-start' },
          }" />
        <USelectMenu
          v-model="selectedSort"
          :options="sorts"
          color="white"
          placeholder="Sort"
          value-attribute="id"
          :ui-menu="{
            container: 'min-w-fit',
            popper: { placement: 'bottom-start' },
          }" />
        <UButton
          v-if="selectedSkill || selectedSort"
          variant="link"
          label="Reset"
          @click="reset" />
        <UIcon
          v-if="status === 'pending'"
          name="heroicons:arrow-path"
          class="h-6 w-6 animate-spin text-gray-300 dark:text-gray-600" />
      </div>
      <!-- right -->
      <div class="hidden items-center gap-2 sm:flex">
        <UButton
          color="black"
          icon="heroicons:plus-circle"
          label="Add your Project"
          @click="addProjectModal = true" />
      </div>
    </div>

    <!-- listing -->
    <div v-if="error" class="flex flex-col gap-4 py-8">
      <div class="space-y-2">
        <span
          class="block text-center font-bold text-gray-500 dark:text-gray-400">
          Opps...
        </span>
        <span
          class="block text-center text-sm text-gray-500 dark:text-gray-400">
          We apologize, but something went wrong.
        </span>
      </div>
      <UButton
        color="white"
        icon="heroicons:arrow-path"
        label="Try Again"
        class="mx-auto"
        :loading="status === 'pending'"
        @click="refresh" />
    </div>

    <div v-if="!error">
      <div
        v-if="listingData?.records?.length"
        class="grid gap-4 lg:grid-cols-3">
        <ProjectListingCard
          v-for="project in listingData.records"
          :key="project.id"
          :project="project" />
      </div>
      <div v-else class="flex flex-col gap-2 py-8">
        <UIcon
          name="heroicons:document-magnifying-glass"
          class="mx-auto block h-8 w-8 text-gray-300 dark:text-gray-600" />
        <span
          class="block text-center text-sm text-gray-500 dark:text-gray-400">
          No projects found
        </span>
      </div>
    </div>

    <!-- pagination -->
    <div
      v-if="!error && listingData?.records?.length"
      class="flex w-full justify-between gap-2">
      <!-- left -->
      <div class="flex items-center">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ paginationLabel }}
        </span>
      </div>
      <!-- right -->
      <div class="flex items-center gap-2">
        <UIcon
          v-if="status === 'pending'"
          name="heroicons:arrow-path"
          class="h-6 w-6 animate-spin text-gray-300 dark:text-gray-600" />
        <UPagination
          v-model="pagination.page"
          :page-count="pagination.perPage"
          :active-button="{
            color: 'black',
          }"
          :total="total" />
      </div>
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
const selectedSkill = useRouteQuery<string | undefined>("skill");
const { data: skills, status: skillsStatus } = useFetch("/api/skills");
const skillIsLoading = computed(() => skillsStatus.value === "pending");

const selectedSort = useRouteQuery<string | undefined>("sort");
const sorts = [
  { label: "Newest First", id: "newest" },
  { label: "Oldest First", id: "oldest" },
];

const pagination = ref({
  page: 1,
  perPage: 15,
});

const {
  data: listingData,
  refresh,
  status,
  error,
} = useFetch("/api/projects", {
  method: "POST",
  body: {
    pageOptions: pagination,
    sort: selectedSort,
    filters: { skill: selectedSkill },
  },
});

const total = computed(() => listingData.value?.pagination.total || 0);
const paginationLabel = computed(() => {
  return `Showing ${(pagination.value.page - 1) * pagination.value.perPage + 1} to ${Math.min(pagination.value.page * pagination.value.perPage, total.value as number)} of ${total.value} listings`;
});

watch([selectedSkill, selectedSort], () => {
  pagination.value.page = 1;
});

const reset = () => {
  selectedSkill.value = undefined;
  selectedSort.value = undefined;
  pagination.value.page = 1;
};

const addProjectModal = ref(false);
const onProjectAddComplete = ({ id }: { id: string }) => {
  navigateTo(`/project/${id}`);
};
</script>
