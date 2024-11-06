<template>
  <UCard>
    <template #header>
      <div class="flex justify-between gap-4">
        <span class="font-bold text-gray-700 dark:text-gray-300">
          Edit Skills Wanted
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
        :loading="loading"
        :disabled="loading"
        @click="form?.submit">
        Update Skills Wanted
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { Form, FormSubmitEvent } from "#ui/types";
import type { NuxtError } from "#app";

const props = defineProps<{
  initialState: {
    id: string;
    skills: string[];
  };
}>();

const emits = defineEmits<{
  close: [];
  refresh: [];
}>();

const toast = useToast();
const loading = ref(false);

const schema = z.object({ skills: z.string().array() });
type Schema = z.output<typeof schema>;

const form = useTemplateRef<Form<Schema>>("form");

const state = reactive({
  skills: [...props.initialState.skills],
});

const { data: skills, status: skillsStatus } = await useFetch("/api/skills");
const skillsIsLoading = computed(() => skillsStatus.value === "pending");
const removeSkill = (index: number) => {
  state.skills.splice(index, 1);
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    loading.value = true;
    await $fetch("/api/project/skills", {
      method: "PUT",
      query: { id: props.initialState.id },
      body: event.data,
    });
    toast.add({
      title: "Successful",
      description: "Skills Wanted updated.",
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
