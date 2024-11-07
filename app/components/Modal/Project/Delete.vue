<template>
  <UCard>
    <template #header>
      <div class="flex justify-between gap-4">
        <span
          class="block w-full truncate font-bold text-gray-700 dark:text-gray-300">
          Deleting {{ props.project.title }}
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
      :state="state"
      :schema="schema"
      class="space-y-4"
      @submit="onSubmit">
      <UFormGroup
        label="Are you sure you want to delete?"
        description='Enter "DELETE" to confirm.'
        name="confirmation"
        size="lg"
        required>
        <UInput v-model="state.confirmation" placeholder="DELETE" />
      </UFormGroup>
    </UForm>

    <template #footer>
      <UButton
        block
        color="red"
        type="submit"
        size="lg"
        :loading="loading"
        :disabled="loading"
        @click="form?.submit">
        Confirm Delete
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { Form } from "#ui/types";
import type { NuxtError } from "#app";

const props = defineProps<{
  id: string;
  project: {
    title: string;
  };
}>();

const emits = defineEmits<{
  close: [];
  refresh: [];
  onComplete: [];
}>();

const toast = useToast();
const loading = ref(false);

const schema = z.object({
  confirmation: z.literal("DELETE", { message: 'Enter "DELETE" to confirm.' }),
});
type Schema = z.output<typeof schema>;

const state = reactive({
  confirmation: undefined,
});

const form = useTemplateRef<Form<Schema>>("form");

const onSubmit = async () => {
  try {
    loading.value = true;

    await $fetch("/api/project", {
      method: "DELETE",
      query: { id: props.id },
    });
    toast.add({
      title: "Successful",
      description: "Project has been deleted.",
      color: "primary",
    });

    emits("refresh");
    emits("onComplete");
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
