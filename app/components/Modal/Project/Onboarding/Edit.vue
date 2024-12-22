<template>
  <UCard>
    <template #header>
      <div class="flex justify-between gap-4">
        <span class="font-bold text-gray-700 dark:text-gray-300">
          {{ props.initialState ? "Edit Onboarding" : "Setup Onboarding" }}
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

    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit">
      <UFormGroup
        label="Orientation Content"
        name="orientationContent"
        size="lg"
        required>
        <template #hint>
          <UButton
            :label="showPreview ? 'Editor' : 'Preview'"
            variant="ghost"
            size="xs"
            @click="showPreview = !showPreview" />
        </template>
        <div
          class="mb-1 space-y-3 text-[0.85rem] text-gray-600 dark:text-gray-400">
          <p>
            Help potential contributors understand how they can contribute to
            your project with this tailored content. It is important to make
            them feel welcome and provide them with the necessary information to
            get started.
          </p>
          <p class="font-medium">
            This will be displayed to potential contributors upon clicking the
            "Contribute" button.
          </p>
        </div>

        <UCard
          v-if="showPreview"
          :ui="{
            base: 'min-h-[120px]',
            body: { padding: 'px-3.5 py-2' },
            strategy: 'override',
          }">
          <ProjectContent
            v-if="contentPreview"
            :data="{ renderedContent: contentPreview }" />
        </UCard>
        <UTextarea
          v-else
          v-model="state.orientationContent"
          placeholder="Supports markdown formatting"
          :rows="5"
          autoresize />
      </UFormGroup>

      <UFormGroup label="Call-to-Action Link" name="callToActionUrl" size="lg">
        <div
          class="mb-1 space-y-3 text-[0.85rem] text-gray-600 dark:text-gray-400">
          <p>
            Provide a link to a page where potential contributors can be
            redirected to. Call-to-action will not be displayed if is not
            provided.
          </p>
        </div>
        <UInput v-model="state.callToActionUrl" />
      </UFormGroup>
    </UForm>

    <template #footer>
      <UButton
        block
        color="black"
        type="submit"
        size="lg"
        :loading="loading"
        :disabled="loading"
        @click="form?.submit">
        {{ props.initialState ? "Update Onboarding" : "Complete Setup" }}
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import markdownParser from "@nuxt/content/transformers/markdown";
import { projectOnboardingSchema as schema } from "~~/validation/project";

import type { z } from "zod";
import type { Form, FormSubmitEvent } from "#ui/types";
import type { NuxtError } from "#app";

const props = defineProps<{
  id: string;
  initialState?: {
    orientationContent?: string | null;
    callToActionUrl?: string | null;
  } | null;
}>();

const emits = defineEmits<{
  close: [];
  refresh: [];
}>();

const toast = useToast();
const loading = ref(false);

type Schema = z.output<typeof schema>;

const form = useTemplateRef<Form<Schema>>("form");

const state = reactive({
  orientationContent: props.initialState?.orientationContent || undefined,
  callToActionUrl: props.initialState?.callToActionUrl || undefined,
});

const showPreview = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const contentPreview = ref<Record<string, any> | null>(null);
watch(showPreview, () => {
  if (showPreview.value) {
    void markdownParser
      .parse("preview", state.orientationContent as string)
      .then((data: typeof orientationContent.value) => {
        contentPreview.value = data;
      });
  } else {
    contentPreview.value = null;
  }
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    loading.value = true;
    await $fetch("/api/project/onboarding", {
      method: "PUT",
      query: { id: props.id },
      body: event.data,
    });
    toast.add({
      title: "Successful",
      description: props.initialState
        ? "Project onboarding updated."
        : "Project onboarding setup complete.",
      color: "green",
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
