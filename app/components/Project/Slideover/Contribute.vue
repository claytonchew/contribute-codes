<template>
  <UCard
    class="flex flex-1 flex-col"
    :ui="{
      body: { base: 'flex-1 overflow-y-auto' },
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      base: 'h-[100dvh]',
    }">
    <template #header>
      <div class="flex justify-between gap-4">
        <span class="font-semibold text-gray-700 dark:text-gray-300">
          Contribute
        </span>
        <UButton
          color="gray"
          variant="ghost"
          icon="heroicons:x-mark"
          class="-my-1"
          @click="emits('close')" />
      </div>
    </template>

    <ProjectContent
      v-if="props.onboarding"
      :data="{
        renderedContent: props.onboarding.renderedOrientationContent,
      }" />

    <template v-if="props.onboarding?.callToActionUrl" #footer>
      <UButton
        :to="props.onboarding.callToActionUrl"
        target="_blank"
        rel="noopener noreferrer"
        icon="heroicons:arrow-up-right-20-solid"
        color="black"
        size="lg"
        trailing
        block>
        Contribute Now
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  onboarding: {
    renderedOrientationContent: string;
    callToActionUrl: string | null;
  } | null;
}>();

const emits = defineEmits<{
  close: [];
}>();
</script>
