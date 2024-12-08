<template>
  <div>
    <UTable
      :columns="columns"
      :rows="data"
      :empty-state="{
        icon: 'heroicons:document-text',
        label: 'There\'s no pending contributor requests.',
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
      <template #requester-data="{ row }">
        <span>
          <strong>{{ row.requester.name }}</strong> wants to add
          <strong>you</strong> as a contributor.
        </span>
      </template>
      <template #project-data="{ row }">
        <UButton
          :to="`/project/${row.project.id}`"
          variant="link"
          :padded="false">
          <span class="block max-w-80 truncate">
            {{ row.project.title }}
          </span>
        </UButton>
      </template>
      <template #actions-data="{ row }">
        <div class="flex gap-4">
          <UButton
            color="green"
            variant="ghost"
            icon="heroicons:check"
            label="Accept"
            :loading="row.loading"
            @click="acceptRequest(row)" />
          <UButton
            color="red"
            variant="ghost"
            icon="heroicons:x-mark"
            label="Decline"
            :loading="row.loading"
            @click="declineRequest(row)" />
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
import type { SerializeObject } from "nitropack";

type ContributorRequest = SerializeObject<{
  requester: {
    name: string;
    avatar: string | null;
  } | null;
  project: {
    id: string;
    title: string;
    snippet: string;
  } | null;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  requestedBy: string | null;
  acceptedAt: Date | null;
}>;

const toast = useToast();

const { data, refresh } = await useAsyncData<ContributorRequest[]>(
  "me/requests/contributors",
  () => useRequestFetch()("/api/me/contributor-requests"),
);

const columns = [
  {
    key: "createdAt",
    label: "Date",
  },
  {
    key: "requester",
    label: "Request",
  },
  {
    key: "project",
    label: "Project",
  },
  {
    key: "actions",
  },
];

const acceptRequest = async (row: ContributorRequest) => {
  await $fetch("/api/me/contributor-requests/accept", {
    method: "POST",
    query: {
      projectId: row.projectId,
    },
  })
    .then(() => {
      refresh();
    })
    .catch((error: unknown) => {
      const { data } = error as NuxtError<{ statusMessage: string }>;

      toast.add({
        title: "Unsuccessful",
        description:
          data?.statusMessage ||
          (error as Error)?.message ||
          "An error occurred",
        color: "red",
      });
    });
};

const declineRequest = async (row: ContributorRequest) => {
  await $fetch("/api/me/contributor-requests/decline", {
    method: "POST",
    query: {
      projectId: row.projectId,
    },
  })
    .then(() => {
      refresh();
    })
    .catch((error: unknown) => {
      const { data } = error as NuxtError<{ statusMessage: string }>;

      toast.add({
        title: "Unsuccessful",
        description:
          data?.statusMessage ||
          (error as Error)?.message ||
          "An error occurred",
        color: "red",
      });
    });
};
</script>
