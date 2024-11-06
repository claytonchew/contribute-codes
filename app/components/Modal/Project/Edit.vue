<template>
  <ModalProject
    title="Edit your Project"
    submit-label="Update Project"
    :initial-state="props.initialState"
    :submit-handler="submitHandler"
    @close="emits('close')"
    @refresh="emits('refresh')" />
</template>

<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { projectSchema as schema } from "~~/validation/project";

const toast = useToast();

const props = defineProps<{
  initialState: z.output<typeof schema> & { id: string };
}>();

const emits = defineEmits<{
  close: [];
  refresh: [];
}>();

type Schema = z.output<typeof schema>;

const submitHandler = async (event: FormSubmitEvent<Schema>) => {
  const data = await $fetch("/api/project", {
    method: "PUT",
    query: { id: props.initialState.id },
    body: event.data,
  });
  toast.add({
    title: "Successful",
    description: "Project updated.",
    color: "green",
  });

  return data;
};
</script>
