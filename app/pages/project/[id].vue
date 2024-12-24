<template>
  <ProjectPageContainer>
    <template #main>
      <template v-if="isOwner">
        <div class="mb-8 space-y-4">
          <UAlert
            v-if="data?.isPublished"
            color="green"
            variant="outline"
            :actions="publishedActions"
            :ui="{
              actions: 'hidden sm:flex',
            }">
            <template #title>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <UIcon
                    name="heroicons:check-badge"
                    class="h-5 w-5 flex-shrink-0" />
                  <span class="text-sm font-semibold">Project published.</span>
                </div>
                <div class="flex items-center gap-2 sm:hidden">
                  <UButton
                    v-for="action in publishedActions"
                    :key="action.label"
                    v-bind="action"
                    @click.stop="action.click" />
                </div>
              </div>
            </template>
          </UAlert>
          <UAlert
            v-else-if="!data?.isPublished"
            color="primary"
            variant="outline"
            :actions="unpublishedActions"
            :ui="{
              actions: 'hidden sm:flex',
            }">
            <template #title>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <UIcon
                    name="heroicons:information-circle"
                    class="h-5 w-5 flex-shrink-0" />
                  <span class="text-sm font-semibold"
                    >This project is not published.</span
                  >
                </div>
                <div class="flex items-center gap-2 sm:hidden">
                  <UButton
                    v-for="action in unpublishedActions"
                    :key="action.label"
                    v-bind="action"
                    @click.stop="action.click" />
                </div>
              </div>
            </template>
          </UAlert>

          <UAlert
            v-if="!data.onboarding"
            color="primary"
            variant="subtle"
            icon="heroicons:sparkles"
            title='Enable "Contribute" button'
            description="Setup onboarding to help potential contributors navigate your project and understand how they can contribute."
            :actions="[
              {
                variant: 'solid',
                color: 'primary',
                size: 'sm',
                label: 'Setup Onboarding',
                click: () => {
                  editProjectOnboarding = true;
                },
              },
            ]" />
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
        <UButton color="white" size="lg" block @click="showShare = true">
          Share Project
        </UButton>
        <UButton
          v-if="data?.onboarding"
          color="black"
          size="lg"
          block
          @click="showContributeOnboarding = true">
          Contribute
        </UButton>
      </div>

      <div v-if="isOwner">
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
    <UModal
      v-model="editProjectOnboarding"
      :ui="{ width: 'w-full max-w-xl', strategy: 'override' }">
      <ModalProjectOnboardingEdit
        v-if="data"
        :id="data.id"
        :initial-state="data.onboarding"
        @close="editProjectOnboarding = false"
        @refresh="refresh" />
    </UModal>

    <UModal v-model="showShare" :ui="{ width: 'max-w-xl' }">
      <ModalProjectShare :project="data" @close="showShare = false" />
    </UModal>
    <USlideover
      v-if="data && 'onboarding' in data"
      v-model="showContributeOnboarding"
      :ui="{ width: 'max-w-xl' }">
      <ProjectSlideoverContribute
        :onboarding="data.onboarding"
        @close="showContributeOnboarding = false" />
    </USlideover>
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
      ...(res.onboarding && {
        onboarding: {
          ...res.onboarding,
          renderedOrientationContent: await markdownParser.parse(
            res.onboarding.projectId + "-orientation",
            res.onboarding.orientationContent,
          ),
        },
      }),
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

const showContributeOnboarding = ref(false);
const showShare = ref(false);

const isOwner = computed(() => {
  return data.value?.owner?.id === useUserSession().user.value?.id;
});

const editProjectModal = ref(false);

const deleteProjectModal = ref(false);
const handlePostDelete = () => {
  navigateTo("/");
};

const editProjectOnboarding = ref(false);

const publishIsLoading = ref(false);
const publishProject = async () => {
  if (isOwner.value) {
    publishIsLoading.value = true;
    await $fetch("/api/project/publish", {
      method: "POST",
      query: { id: data.value!.id },
    })
      .then(() => {
        toast.add({
          title: "Successful",
          description: "Your project is now live.",
          color: "green",
        });
        data.value!.isPublished = true;
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
      query: { id: data.value!.id },
    })
      .then(() => {
        toast.add({
          title: "Successful",
          description: "Project unpublished.",
          color: "green",
        });
        data.value!.isPublished = false;
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

const publishedActions = computed(() => [
  ...(data.value?.onboarding
    ? [
        {
          variant: "solid",
          color: "white",
          size: "sm",
          label: "Edit Onboarding",
          click: () => {
            editProjectOnboarding.value = true;
          },
        },
      ]
    : []),
  {
    variant: "solid",
    color: "white",
    size: "sm",
    label: "Edit Project",
    click: () => {
      editProjectModal.value = true;
    },
  },
  {
    variant: "soft",
    color: "red",
    size: "sm",
    label: "Unpublish",
    loading: unpublishIsLoading.value,
    click: () => {
      unpublishProject();
    },
  },
]);

const unpublishedActions = computed(() => [
  ...(data.value?.onboarding
    ? [
        {
          variant: "solid",
          color: "white",
          size: "sm",
          label: "Edit Onboarding",
          click: () => {
            editProjectOnboarding.value = true;
          },
        },
      ]
    : []),
  {
    variant: "solid",
    color: "white",
    size: "sm",
    label: "Edit Project",
    click: () => {
      editProjectModal.value = true;
    },
  },
  {
    icon: "heroicons:rocket-launch-solid",
    variant: "solid",
    color: "primary",
    size: "sm",
    label: "Publish Now",
    loading: publishIsLoading.value,
    click: () => {
      publishProject();
    },
  },
]);
</script>
