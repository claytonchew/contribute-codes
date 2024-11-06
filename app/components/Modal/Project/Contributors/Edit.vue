<template>
  <UCard>
    <template #header>
      <div class="flex justify-between gap-4">
        <span class="font-bold text-gray-700 dark:text-gray-300">
          Edit Contributors
        </span>
        <UButton
          color="gray"
          variant="ghost"
          icon="heroicons:x-mark"
          class="-my-1"
          :loading="loading"
          @click="emits('close')" />
      </div>
    </template>

    <div class="space-y-4">
      <UButtonGroup class="flex w-full" size="lg">
        <USelectMenu
          v-model="selected"
          class="w-full"
          :searchable="lookUpUser"
          icon="heroicons:magnifying-glass"
          placeholder="Search name or email...">
          <template #label>
            <div v-if="selected" class="flex items-center gap-3">
              <UAvatar
                :src="selected.avatar || undefined"
                :alt="selected.name"
                size="xs" />
              <div class="grid">
                <span class="truncate text-xs font-bold">
                  {{ selected.name }}
                </span>
                <span class="truncate text-xs text-gray-500 dark:text-gray-400">
                  {{ selected.email }}
                </span>
              </div>
            </div>
          </template>

          <template #option="{ option }">
            <div class="flex items-center gap-3">
              <UAvatar :src="option.avatar" :alt="option.name" size="xs" />
              <div class="grid">
                <span class="truncate text-xs font-bold">
                  {{ option.name }}
                </span>
                <span class="truncate text-xs text-gray-500 dark:text-gray-400">
                  {{ option.email }}
                </span>
              </div>
            </div>
          </template>
        </USelectMenu>
        <UButton
          color="gray"
          label="Invite"
          :disabled="!selected"
          :loading="loading"
          @click="addContributor" />
      </UButtonGroup>

      <UCard :ui="{ body: { padding: '' } }">
        <UTable
          :rows="contributors"
          :columns="columns"
          :empty-state="{
            icon: 'heroicons:user-group',
            label: 'No contributors',
          }"
          :ui="{
            emptyState: { wrapper: 'py-2', icon: 'mb-1' },
          }">
          <template #name-data="{ row }">
            <div class="items -center flex gap-4">
              <UAvatar
                :src="row.avatar || undefined"
                :alt="row.name"
                size="sm" />
              <div>
                <span
                  class="block text-xs font-bold text-black dark:text-white">
                  {{ row.name }}
                </span>
                <span class="block text-xs text-gray-500 dark:text-gray-400">
                  {{ row.email }}
                </span>
              </div>
            </div>
          </template>
          <template #status-data="{ row }">
            <UBadge v-if="!row.acceptedAt" color="yellow" variant="subtle">
              Pending
            </UBadge>
            <UBadge v-else color="green" variant="subtle"> Added </UBadge>
          </template>
          <template #action-data="{ row }">
            <UButton
              color="gray"
              label="Remove"
              icon="heroicons:trash"
              size="xs"
              :loading="loading"
              @click="removeContributor(row.id)" />
          </template>
        </UTable>
      </UCard>
    </div>

    <template #footer>
      <UButton
        block
        color="black"
        type="submit"
        size="lg"
        :loading="loading"
        :disabled="loading"
        @click="onSubmit">
        Update Contributors
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  id: string;
}>();

const emits = defineEmits<{
  close: [];
  refresh: [];
}>();

const toast = useToast();

const loading = ref(false);
const contributors = ref<
  | undefined
  | {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
      acceptedAt: string | null;
    }[]
>(undefined);
const { data: contributorsData } = await useFetch("/api/project/contributors", {
  query: { id: props.id },
});
contributors.value = contributorsData.value;

const selected = ref<
  | undefined
  | {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
      acceptedAt: string | null;
    }
>();
const lookUpUser = async (keyword?: string) => {
  if (!keyword) {
    return [];
  }
  return await $fetch("/api/user/lookup", {
    query: { keyword },
  });
};
const columns = [
  {
    key: "name",
    label: "Contributor",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "action",
    label: "Action",
  },
];
const addContributor = () => {
  if (!contributors.value) return;
  if (!selected.value) return;
  if (contributors.value.find((c) => c.id === selected.value?.id)) {
    return;
  }
  contributors.value.push({
    ...selected.value,
    acceptedAt: null,
  });
  selected.value = undefined;
};
const removeContributor = (id: string) => {
  if (!contributors.value) return;
  const index = contributors.value.findIndex((c) => c.id === id);
  if (index === -1) return;
  contributors.value.splice(index, 1);
};

const onSubmit = async () => {
  try {
    loading.value = true;

    await $fetch("/api/project/contributors", {
      method: "PUT",
      query: { id: props.id },
      body: {
        contributorIds: contributors.value?.map(
          (contributor) => contributor.id,
        ),
      },
    });
    emits("refresh");
    emits("close");
  } catch (error: unknown) {
    loading.value = false;

    const { data } = error as NuxtError<{ statusMessage: string }>;

    toast.add({
      title: "Unsuccessful",
      description:
        data?.statusMessage || (error as Error)?.message || "An error occurred",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};
</script>
