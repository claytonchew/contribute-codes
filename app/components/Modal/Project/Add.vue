<template>
  <ModalProject
    title="Add your Project"
    submit-label="Add Project"
    submit-icon="heroicons:plus-circle"
    :submit-handler="submitHandler"
    @close="emits('close')"
    @refresh="emits('refresh')"
    @complete="onComplete" />
</template>

<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { projectSchema as schema } from "~~/validation/project";
import type { InferSelectModel } from "drizzle-orm";

const toast = useToast();

const emits = defineEmits<{
  close: [];
  refresh: [];
  complete: [InferSelectModel<typeof tables.project.project>];
}>();

type Schema = z.output<typeof schema>;

const submitHandler = async (event: FormSubmitEvent<Schema>) => {
  const data = await $fetch("/api/project", {
    method: "POST",
    body: event.data,
  });
  toast.add({
    title: "Successful",
    description: "Project added.",
    color: "green",
  });

  return data;
};

const onComplete = (data: InferSelectModel<typeof tables.project.project>) => {
  emits("complete", data);
};
</script>
