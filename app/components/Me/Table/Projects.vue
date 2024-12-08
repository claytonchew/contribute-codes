<template>
  <div>
    <UTable
      :columns="columns"
      :rows="data"
      :empty-state="{
        icon: 'heroicons:document-text',
        label: 'No projects added by you yet.',
      }"
      :ui="{
        emptyState: { wrapper: 'py-2', icon: 'mb-1' },
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
        <UButton :to="`/project/${row.id}`" variant="link" :padded="false">
          <span class="block max-w-80 truncate">
            {{ row.title }}
          </span>
        </UButton>
      </template>
      <template #owner-data="{ row }">
        <div class="flex min-w-0 items-center gap-3">
          <UAvatar
            :src="row.owner.avatar || undefined"
            :alt="row.owner.name"
            size="xs" />

          <div class="min-w-0 text-sm">
            <span class="block truncate font-medium">
              {{ row.owner.name }}
            </span>
          </div>
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData("me/projects", () =>
  useRequestFetch()("/api/me/projects"),
);

const columns = [
  {
    key: "createdAt",
    label: "Published On",
  },
  {
    key: "title",
    label: "Title",
  },
  {
    key: "owner",
    label: "Owner",
  },
];
</script>
