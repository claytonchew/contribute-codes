<template>
  <ProjectPageContainer>
    <template #main>
      <template v-if="isOwner">
        <div class="mb-8 flex justify-between gap-4">
          <UAlert
            v-if="data.isPublished"
            icon="heroicons:check-badge"
            title="Project published."
            :actions="[
              {
                variant: 'ghost',
                color: 'primary',
                size: 'sm',
                label: 'Unpublish',
                loading: unpublishIsLoading,
                click: unpublishProject,
              },
              {
                variant: 'soft',
                color: 'primary',
                size: 'sm',
                label: 'Edit Project',
                click: () => {
                  editProjectModal = true;
                },
              },
            ]"
            :ui="{
              title: 'text-green-600 dark:text-green-400',
              icon: { base: 'text-green-600 dark:text-green-400' },
            }" />
          <UAlert
            v-else-if="!data.isPublished"
            color="primary"
            variant="subtle"
            icon="heroicons:information-circle"
            title="This project is not published."
            :actions="[
              {
                variant: 'soft',
                color: 'primary',
                size: 'sm',
                label: 'Edit Project',
                click: () => {
                  editProjectModal = true;
                },
              },
              {
                icon: 'heroicons:rocket-launch-solid',
                variant: 'solid',
                color: 'primary',
                size: 'sm',
                label: 'Publish Now',
                loading: publishIsLoading,
                click: publishProject,
              },
            ]"
            :ui="{
              variant: { subtle: 'dark:bg-opacity-5 bg-opacity-20' },
            }" />
        </div>
      </template>

      <ProjectContent v-if="data" :data="data" />
    </template>

    <template #aside>
      <div v-if="data" class="space-y-6">
        <ProjectAsideProjectOwner :data="data" />
        <ProjectAsideCreatedAt :data="data" />
        <ProjectAsideRepositoryURL :data="data" />
        <ProjectAsideProjectSite :data="data" />
      </div>

      <ProjectAsideSkillsWanted v-if="data" :data="data" @refresh="refresh" />

      <ProjectAsideContributors v-if="data" :data="data" @refresh="refresh" />

      <div class="space-y-2">
        <ProjectShare v-if="data.isPublished" />
        <UButton v-if="!isOwner" color="black" size="lg" block>
          Volunteer this project
        </UButton>
        <UButton
          v-if="isOwner"
          icon="heroicons:trash"
          color="red"
          variant="soft"
          size="lg"
          block
          @click="deleteProjectModal = true">
          Delete Project
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
    <UModal
      v-model="deleteProjectModal"
      :ui="{ width: 'w-full max-w-xl', strategy: 'override' }">
      <ModalProjectDelete
        v-if="data"
        :id="data.id"
        :project="data"
        @close="deleteProjectModal = false"
        @on-complete="handlePostDelete" />
    </UModal>
  </ProjectPageContainer>
</template>

<script setup lang="ts">
import markdownParser from "@nuxt/content/transformers/markdown";

const route = useRoute();
const toast = useToast();

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
      statusCode: error.value?.statusCode || 404,
      statusMessage: error.value?.statusMessage || "Project not found",
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

const deleteProjectModal = ref(false);
const handlePostDelete = () => {
  navigateTo("/");
};

const publishIsLoading = ref(false);
const publishProject = async () => {
  if (isOwner.value) {
    publishIsLoading.value = true;
    await $fetch("/api/project/publish", {
      method: "POST",
      query: { id: data.value.id },
    })
      .then(() => {
        toast.add({
          title: "Successful",
          description: "Your project is now live.",
          color: "green",
        });
        data.value.isPublished = true;
        refresh();
      })
      .catch(() => {
        toast.add({
          title: "Error",
          description: "Failed to publish project.",
          color: "red",
        });
      })
      .finally(() => {
        publishIsLoading.value = false;
      });
  }
};

const unpublishIsLoading = ref(false);
const unpublishProject = async () => {
  if (isOwner.value) {
    unpublishIsLoading.value = true;
    await $fetch("/api/project/unpublish", {
      method: "POST",
      query: { id: data.value.id },
    })
      .then(() => {
        toast.add({
          title: "Successful",
          description: "Project unpublished.",
          color: "green",
        });
        data.value.isPublished = false;
        refresh();
      })
      .catch(() => {
        toast.add({
          title: "Error",
          description: "Failed to unpublish project.",
          color: "red",
        });
      })
      .finally(() => {
        unpublishIsLoading.value = false;
      });
  }
};
</script>
