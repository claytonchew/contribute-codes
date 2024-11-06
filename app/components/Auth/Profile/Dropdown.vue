<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'auto' }">
    <template #default="{ open }">
      <UButton
        color="gray"
        class="max-w-48"
        size="md"
        icon="heroicons:chevron-down-16-solid"
        truncate
        trailing
        :label="user?.name"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
        :ui="{ rounded: 'rounded-full' }">
        <template #leading>
          <UAvatar
            :src="user?.avatar ?? undefined"
            :alt="user?.name"
            size="2xs" />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="min-w-0 text-left text-xs">
        <span class="block">Signed in as</span>
        <span class="block truncate font-medium">
          {{ user?.email }}
        </span>
      </div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
import type { DropdownItem } from "~~/node_modules/@nuxt/ui/dist/runtime/types/dropdown";

const props = defineProps({
  links: {
    type: Array as PropType<DropdownItem[][]>,
    default: () => [],
  },
});

const { user } = useUserSession();

const items = [
  [
    {
      slot: "account",
      label: "Account",
      disabled: true,
    },
  ],
  ...props.links,
];
</script>
