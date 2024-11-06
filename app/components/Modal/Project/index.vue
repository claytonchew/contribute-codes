<template>
  <AuthState v-slot="{ loggedIn }">
    <UCard v-if="loggedIn">
      <template #header>
        <div class="flex justify-between gap-4">
          <span class="font-bold text-gray-700 dark:text-gray-300">
            {{ props.title }}
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
          label="Title"
          name="title"
          description="Keep it short. Max 255 characters"
          size="lg"
          required>
          <UInput v-model="state.title" />
        </UFormGroup>
        <UFormGroup
          label="Content"
          name="content"
          description="Introduce what your project is all about."
          size="lg"
          required>
          <template #hint>
            <UButton
              :label="showPreview ? 'Editor' : 'Preview'"
              variant="link"
              size="xs"
              @click="showPreview = !showPreview" />
          </template>
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
            v-model="state.content"
            placeholder="Supports markdown formatting"
            :rows="5"
            autoresize />
        </UFormGroup>
        <UFormGroup label="Repository URL" name="repositoryUrl" size="lg">
          <UInput
            v-model="state.repositoryUrl"
            placeholder="https://github.com/owner/repository" />
        </UFormGroup>
        <UFormGroup label="Project Site" name="projectUrl" size="lg">
          <UInput
            v-model="state.projectUrl"
            placeholder="https://example.com" />
        </UFormGroup>
        <UFormGroup label="Skills Wanted" name="skills" size="lg">
          <USelectMenu
            v-model="state.skills"
            multiple
            searchable
            searchable-placeholder="Search a skill"
            :options="skills"
            :loading="skillsIsLoading" />
          <div class="mt-2">
            <UButton
              v-for="(skill, index) in state.skills"
              :key="skill"
              size="xs"
              color="white"
              :label="skill"
              icon="heroicons:x-mark"
              class="ml-1"
              trailing
              :ui="{
                rounded: 'rounded-full',
              }"
              @click="removeSkill(index)" />
          </div>
        </UFormGroup>
      </UForm>

      <template #footer>
        <UButton
          block
          color="black"
          type="submit"
          size="lg"
          :icon="props.submitIcon"
          :loading="loading"
          :disabled="loading"
          @click="form?.submit">
          {{ props.submitLabel }}
        </UButton>
      </template>
    </UCard>

    <UCard v-else>
      <template #header>
        <div class="flex justify-between gap-4">
          <span class="flex gap-x-2 font-bold text-gray-700 dark:text-gray-300">
            <UIcon
              name="heroicons:information-circle"
              class="h-6 w-6 flex-shrink-0" />
            <span>Sign In to add a project</span>
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

      <div class="flex flex-col items-center justify-center gap-y-8 py-16">
        <span class="text-sm">
          To add your project, you will need to Sign In
        </span>
        <AuthButton
          label="Sign in with GitHub"
          path="/auth/github"
          redirect-path="/"
          icon="simple-icons:github"
          size="lg" />
      </div>
    </UCard>
  </AuthState>
</template>

<script setup lang="ts">
import markdownParser from "@nuxt/content/transformers/markdown";
import { projectSchema as schema } from "~~/validation/project";

import type { z } from "zod";
import type { Form, FormSubmitEvent } from "#ui/types";
import type { NuxtError } from "#app";

const props = defineProps<{
  initialState?: Partial<z.input<typeof schema>>;
  title: string;
  submitLabel: string;
  submitIcon?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitHandler: (event: FormSubmitEvent<Schema>) => Promise<any>;
}>();

const emits = defineEmits<{
  close: [];
  refresh: [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  complete: [any];
}>();

const toast = useToast();
const loading = ref(false);

type Schema = z.output<typeof schema>;

const form = useTemplateRef<Form<Schema>>("form");

const state = reactive({
  title: props.initialState?.title ?? undefined,
  content: props.initialState?.content ?? undefined,
  repositoryUrl: props.initialState?.repositoryUrl ?? undefined,
  projectUrl: props.initialState?.projectUrl ?? undefined,
  skills: [...(props.initialState?.skills ?? [])],
});

const showPreview = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const contentPreview = ref<Record<string, any> | null>(null);
watch(showPreview, () => {
  if (showPreview.value) {
    void markdownParser
      .parse("preview", state.content as string)
      .then((data: typeof contentPreview.value) => {
        contentPreview.value = data;
      });
  } else {
    contentPreview.value = null;
  }
});

const { data: skills, status: skillsStatus } = await useFetch("/api/skills");
const skillsIsLoading = computed(() => skillsStatus.value === "pending");
const removeSkill = (index: number) => {
  state.skills.splice(index, 1);
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    loading.value = true;
    const data = await props.submitHandler(event);
    emits("complete", data);
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
