<template>
  <ProjectPageContainer>
    <template #main>
      <div class="mb-8 flex justify-between gap-4">
        <div class="flex items-center gap-2">
          <UButton
            to="/"
            icon="heroicons:arrow-long-left-16-solid"
            variant="link"
            color="black"
            :padded="false">
            Explore other projects
          </UButton>
        </div>

        <UButton
          v-if="isOwner"
          icon="heroicons:pencil-square"
          label="Edit"
          variant="ghost"
          size="sm"
          @click="editProjectModal = true" />
      </div>

      <ProjectContent v-if="data" :data="data" />
    </template>

    <template #aside>
      <div v-if="data" class="space-y-6">
        <ProjectAsideProjectOwner :data="data" />
        <ProjectAsidePublishedAt :data="data" />
        <ProjectAsideRepositoryURL :data="data" />
        <ProjectAsideProjectSite :data="data" />
      </div>

      <ProjectAsideSkillsWanted v-if="data" :data="data" @refresh="refresh" />

      <ProjectAsideContributors v-if="data" :data="data" />

      <div class="space-y-2">
        <UButton color="white" size="lg" block> Share Project </UButton>
        <UButton v-if="!isOwner" color="black" size="lg" block>
          Volunteer this project
        </UButton>
      </div>
    </template>

    <UModal
      v-model="editProjectModal"
      :ui="{ width: 'w-full max-w-xl', strategy: 'override' }">
      <ModalProjectEdit
        v-if="data"
        :initial-state="data"
        @close="editProjectModal = false"
        @refresh="refresh" />
    </UModal>
  </ProjectPageContainer>
</template>

<script setup lang="ts">
import markdownParser from "@nuxt/content/transformers/markdown";

const route = useRoute();

const { data, error, refresh } = await useAsyncData(() =>
  useRequestFetch()("/api/project", {
    query: { id: route.params.id },
  }).then(async (res) => {
    return {
      ...res,
      renderedContent: await markdownParser.parse(res?.id, res?.content),
    };
  }),
);

whenever(
  error,
  () => {
    showError({
      statusCode: 404,
      statusMessage: "Project not found",
      fatal: true,
    });
  },
  { immediate: true },
);

useSeoMeta({
  title: data.value?.title,
});

const isOwner = computed(() => {
  return data.value?.owner?.id === useUserSession().user.value?.id;
});

const editProjectModal = ref(false);
</script>
