<template>
  <section>
    <template v-if="props.data.title">
      <h1 class="text-2xl font-semibold">{{ props.data.title }}</h1>
      <UDivider class="py-4" />
    </template>
    <ContentRendererMarkdown
      :value="props.data.renderedContent"
      class="prose-sm dark:prose-invert prose-ul:list-disc prose-ol:list-decimal prose-hr:border-gray-200 dark:prose-hr:border-gray-800 !max-w-none" />
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    title?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderedContent: Record<string, any>;
  };
}>();
</script>
