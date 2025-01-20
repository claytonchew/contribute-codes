<template>
  <div>
    <div class="grid grid-cols-1 gap-4 md:hidden">
      <MeTableProjectsCard
        v-for="project in data"
        :key="project.id"
        :project="project" />
    </div>

    <UCard :ui="{ body: { padding: '' } }" class="hidden md:block">
      <UTable
        :columns="columns"
        :rows="data"
        :empty-state="{
          icon: 'heroicons:document-text',
          label: 'No projects added by you yet.',
        }"
        :ui="{
          emptyState: {
            wrapper: 'py-8',
            icon: 'mb-2',
            label: 'text-gray-500 dark:text-gray-400',
          },
        }">
        <template #createdAt-data="{ row }">
          <span>
            {{
              new Date(row.createdAt).toLocaleDateString("en", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            }}
          </span>
        </template>
        <template #title-data="{ row }">
          <div class="max-w-sm lg:max-w-lg">
            <UButton
              :to="`/project/${row.id}`"
              variant="link"
              :padded="false"
              truncate>
              <span
                class="block max-w-sm truncate text-left text-base lg:max-w-lg">
                {{ row.title }}
              </span>
            </UButton>
            <p class="line-clamp-2 whitespace-pre-line text-sm">
              {{ row.snippet }}
            </p>
          </div>
        </template>
        <template #skills-data="{ row }">
          <div class="flex flex-wrap gap-1">
            <UBadge
              v-for="skill in row.skills.slice(0, 3)"
              :key="skill"
              color="white"
              :ui="{ rounded: 'rounded-full' }">
              {{ skill }}
            </UBadge>
            <UBadge
              v-if="row.skills.length > 3"
              color="white"
              :ui="{ rounded: 'rounded-full' }">
              +{{ row.skills.length - 3 }}
            </UBadge>
          </div>
        </template>
        <template #isPublished-data="{ row }">
          <UIcon
            :name="
              row.isPublished
                ? 'heroicons:check-circle-solid'
                : 'heroicons:x-circle-solid'
            "
            class="h-6 w-6"
            :class="{
              'text-green-500 dark:text-green-400': row.isPublished,
              'text-gray-400 dark:text-gray-600': !row.isPublished,
            }"
            size="lg" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData("me/projects", () =>
  useRequestFetch()("/api/me/projects"),
);

const columns = [
  {
    key: "createdAt",
    label: "Created",
  },
  {
    key: "title",
    label: "Project",
  },
  {
    key: "skills",
    label: "Skills Wanted",
  },
  {
    key: "isPublished",
    label: "Published",
  },
];
</script>
