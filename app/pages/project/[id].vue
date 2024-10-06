<template>
  <UContainer
    class="flex flex-col divide-y divide-gray-200 lg:min-h-[calc(100vh-var(--header-height))] lg:flex-row lg:divide-x dark:divide-gray-800"
    :ui="{ strategy: 'override', padding: 'px-0 lg:px-8' }">
    <div class="grow px-6 py-8 lg:px-0 lg:pr-6">
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
          square />
      </div>

      <section>
        <h1 class="text-2xl font-semibold">{{ data?.title }}</h1>
        <UDivider class="py-4" />
        <ContentRendererMarkdown
          :value="data?.content"
          class="prose-sm dark:prose-invert prose-ul:list-disc prose-ol:list-decimal !max-w-none" />
      </section>
    </div>

    <aside
      class="w-full flex-shrink-0 space-y-8 px-6 py-8 lg:max-w-xs lg:px-0 lg:py-6 lg:pl-4">
      <div class="space-y-6">
        <div>
          <span
            class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Project Owner
          </span>
          <div class="flex items-center">
            <UAvatar
              :src="data?.owner?.avatar || undefined"
              :alt="data?.owner?.name"
              size="xs"
              class="mr-2" />
            <span class="text-sm font-medium">{{ data?.owner?.name }}</span>
          </div>
        </div>
        <div v-if="data?.createdAt">
          <span
            class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Published At
          </span>
          <span class="text-sm font-medium">{{
            new Date(data?.createdAt).toLocaleDateString("en", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          }}</span>
        </div>
        <div v-if="data?.repositoryUrl">
          <span
            class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Repository
          </span>
          <RepositoryLink :url="data?.repositoryUrl" />
        </div>
        <div v-if="data?.projectUrl">
          <span
            class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Project Site
          </span>
          <UButton
            :to="data?.projectUrl"
            variant="link"
            color="black"
            :padded="false"
            size="sm">
            {{ stripURLScheme(data?.projectUrl) }}
          </UButton>
        </div>
      </div>

      <div v-if="(data?.skills || []).length > 0" class="space-y-2">
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
            v-for="skill in data?.skills"
            :key="skill"
            color="white"
            :ui="{ rounded: 'rounded-full' }">
            {{ skill }}
          </UBadge>
        </div>
      </div>

      <div
        v-if="(data?.contributors || []).length > 0 || isOwner"
        class="space-y-2">
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
            <UAvatar v-if="data?.owner" alt="+" size="lg" />
          </ULink>
          <UTooltip
            v-for="contributor in data?.contributors"
            :key="contributor.id"
            :text="contributor.name"
            :popper="{ arrow: true, placement: 'top' }">
            <UAvatar
              :src="contributor?.avatar || undefined"
              :alt="contributor.name"
              size="lg" />
          </UTooltip>
        </div>
      </div>

      <div class="space-y-2">
        <UButton color="white" size="lg" block> Share Project </UButton>
        <UButton v-if="!isOwner" color="black" size="lg" block>
          Volunteer this project
        </UButton>
      </div>
    </aside>
  </UContainer>
</template>

<script setup lang="ts">
import markdownParser from "@nuxt/content/transformers/markdown";

const route = useRoute();

const { data } = await useAsyncData(() =>
  useRequestFetch()("/api/project", {
    query: { id: route.params.id },
  }).then(async (res) => {
    return {
      ...res?.data,
      content: await markdownParser.parse(res?.data?.id, res?.data?.content),
    };
  }),
);

useSeoMeta({
  title: data.value?.title,
});

const isOwner = computed(() => {
  return data.value?.owner?.id === useUserSession().user.value?.id;
});
</script>
