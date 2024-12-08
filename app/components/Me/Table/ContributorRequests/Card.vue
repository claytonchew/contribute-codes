<template>
  <UCard
    v-if="props.request"
    :ui="{
      base: 'flex flex-col h-full',
      divide: 'divide-y-0',
      header: { padding: 'pb-6' },
      body: { base: 'flex-1' },
      footer: { padding: 'pt-0' },
      ring: 'group-hover:ring-primary-500 dark:group-hover:ring-primary-600',
    }">
    <template #header>
      <p class="text-sm">
        <span>
          <strong>{{ props.request.requester?.name }}</strong> wants to add
          <strong>you</strong> as a contributor in
          <UButton
            :to="`/project/${props.request.project?.id}`"
            variant="link"
            class="inline-block max-w-60 truncate break-all text-left font-bold"
            :padded="false"
            truncate>
            {{ props.request.project?.title }}</UButton
          >
        </span>
      </p>
    </template>

    <template #footer>
      <div class="flex items-center justify-between">
        <span class="block py-0.5 text-sm text-gray-700 dark:text-gray-300">
          {{
            new Date(props.request.createdAt).toLocaleDateString("en", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          }}
        </span>
        <div class="flex gap-4">
          <UButton
            color="green"
            variant="ghost"
            icon="heroicons:check"
            label="Accept"
            @click="accept(props.request)" />
          <UButton
            color="red"
            variant="ghost"
            icon="heroicons:x-mark"
            label="Decline"
            @click="decline(props.request)" />
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
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

const props = defineProps<{
  request: ContributorRequest;
  accept: (request: ContributorRequest) => void;
  decline: (request: ContributorRequest) => void;
}>();
</script>
