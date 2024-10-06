<template>
  <UButton
    :to="parsedRepositoryUrl.originalURL"
    :icon="
      parsedRepositoryUrl.parseOK
        ? `simple-icons:${parsedRepositoryUrl.platform}`
        : 'simple-icons:git'
    "
    variant="link"
    color="black"
    :padded="false"
    size="sm">
    {{
      parsedRepositoryUrl.parseOK
        ? `${parsedRepositoryUrl.repository?.owner}/${parsedRepositoryUrl.repository?.name}`
        : stripURLScheme(parsedRepositoryUrl.originalURL)
    }}
  </UButton>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const parsedRepositoryUrl = computed(() => {
  return parseRepositoryURL(props.url);
});
</script>
