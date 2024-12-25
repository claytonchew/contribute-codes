<template>
  <UCard>
    <template #header>
      <div class="flex justify-between gap-4">
        <span class="font-semibold text-gray-700 dark:text-gray-300">
          Share this Project
        </span>
        <UButton
          color="gray"
          variant="ghost"
          icon="heroicons:x-mark"
          class="-my-1"
          @click="emits('close')" />
      </div>
    </template>

    <div class="space-y-4">
      <UFormGroup label="Link" :ui="{ container: 'mt-2' }">
        <UButtonGroup class="flex w-full" size="lg">
          <UInput :model-value="pageUrl" readonly class="grow" />
          <UseClipboard v-slot="{ copy, copied }" :source="pageUrl" legacy>
            <UButton
              color="gray"
              :icon="
                copied
                  ? 'heroicons:check-badge'
                  : 'heroicons:clipboard-document'
              "
              @click.prevent="copy()" />
          </UseClipboard>
        </UButtonGroup>
      </UFormGroup>

      <div class="flex flex-wrap justify-center gap-2">
        <UButton
          v-for="item of itemsComputed"
          :key="item.to"
          v-bind="item"
          color="white"
          size="md" />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { UseClipboard } from "@vueuse/components";

const props = defineProps<{
  url?: string;
}>();

const emits = defineEmits<{
  close: [];
}>();

const pageUrl = computed(() => {
  if (props.url) {
    return new URL(props.url).toString();
  }

  const { fullPath } = useRoute();
  const { baseUrl } = useRuntimeConfig().public;

  return new URL(fullPath, baseUrl).toString();
});

const itemsComputed = computed(() => [
  {
    network: "x",
    label: "Share",
    icon: "simple-icons:x",
    to: `https://x.com/intent/post?url=${encodeURIComponent(pageUrl.value)}`,
    target: "_blank",
    external: true,
  },
  {
    network: "facebook",
    label: "Share",
    icon: "simple-icons:facebook",
    to: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl.value)}`,
    target: "_blank",
    external: true,
  },
  {
    network: "linkedin",
    label: "Share",
    icon: "simple-icons:linkedin",
    to: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl.value)}`,
    target: "_blank",
    external: true,
  },
  {
    network: "reddit",
    label: "Share",
    icon: "simple-icons:reddit",
    to: `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl.value)}`,
    target: "_blank",
    external: true,
  },
  {
    network: "bluesky",
    label: "Share",
    icon: "simple-icons:bluesky",
    to: `https://bsky.app/intent/compose?text=${encodeURIComponent(pageUrl.value)}`,
    target: "_blank",
    external: true,
  },
  {
    network: "whatsapp",
    label: "Share",
    icon: "simple-icons:whatsapp",
    to: `https://api.whatsapp.com/send?text=${encodeURIComponent(pageUrl.value)}`,
    target: "_blank",
    external: true,
  },
  {
    network: "telegram",
    label: "Share",
    icon: "simple-icons:telegram",
    to: `https://t.me/share/url?url=${encodeURIComponent(pageUrl.value)}`,
    target: "_blank",
    external: true,
  },
]);
</script>
