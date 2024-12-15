<template>
  <div class="grid">
    <UDropdown
      mode="hover"
      :items="itemsComputed"
      :popper="{ placement: 'top-end' }"
      :ui="{ wrapper: 'w-full', width: 'w-full max-w-xs lg:w-[300px]' }">
      <UButton color="white" size="lg" block> Share Project </UButton>
    </UDropdown>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  url?: string;
}>();

const pageUrl = computed(() => {
  if (props.url) {
    return new URL(props.url).toString();
  }

  const { fullPath } = useRoute();
  const { baseUrl } = useRuntimeConfig().public;

  return new URL(fullPath, baseUrl).toString();
});

const { copy, isSupported } = useClipboard();
const copyUrl = () => {
  if (isSupported.value) {
    copy(pageUrl.value);
    useToast().add({
      title: "Project link copied",
      color: "green",
    });
  }
};

const xShareUrl = computed(() => {
  return `https://x.com/intent/post?url=${encodeURIComponent(pageUrl.value)}`;
});
const facebookShareUrl = computed(() => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl.value)}`;
});
const linkedInShareUrl = computed(() => {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl.value)}`;
});
const redditShareUrl = computed(() => {
  return `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl.value)}`;
});
const blueskyShareUrl = computed(() => {
  return `https://bsky.app/intent/compose?text=${encodeURIComponent(pageUrl.value)}`;
});
const whatsAppShareUrl = computed(() => {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(pageUrl.value)}`;
});
const telegramShareUrl = computed(() => {
  return `https://t.me/share/url?url=${encodeURIComponent(pageUrl.value)}`;
});

const itemsComputed = computed(() => [
  [
    {
      label: "Share on X",
      icon: "simple-icons:x",
      to: xShareUrl.value,
      target: "_blank",
      external: true,
    },
    {
      label: "Share on Facebook",
      icon: "simple-icons:facebook",
      to: facebookShareUrl.value,
      target: "_blank",
      external: true,
    },
    {
      label: "Share on LinkedIn",
      icon: "simple-icons:linkedin",
      to: linkedInShareUrl.value,
      target: "_blank",
      external: true,
    },
    {
      label: "Share on Reddit",
      icon: "simple-icons:reddit",
      to: redditShareUrl.value,
      target: "_blank",
      external: true,
    },
    {
      label: "Share on Bluesky",
      icon: "simple-icons:bluesky",
      to: blueskyShareUrl.value,
      target: "_blank",
      external: true,
    },
    {
      label: "Share on WhatsApp",
      icon: "simple-icons:whatsapp",
      to: whatsAppShareUrl.value,
      target: "_blank",
      external: true,
    },
    {
      label: "Share on Telegram",
      icon: "simple-icons:telegram",
      to: telegramShareUrl.value,
      target: "_blank",
      external: true,
    },
  ],
  [
    {
      label: "Copy Link",
      icon: "heroicons:link",
      click: () => copyUrl(),
    },
  ],
]);
</script>
