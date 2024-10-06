<template>
  <UButton
    color="black"
    :loading="loading"
    :disabled="loading"
    :ui="{ rounded: 'rounded-full' }"
    external
    :size="props.size"
    :icon="icon"
    :block="props.block"
    @click="open">
    {{ label }}
  </UButton>
</template>

<script setup lang="ts">
import type { ButtonSize } from "~~/node_modules/@nuxt/ui/dist/runtime/types/button";

const loading = ref(false);
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  redirectPath: {
    type: String,
    default: "/",
  },
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<ButtonSize>,
    default: "sm",
  },
  block: {
    type: Boolean,
    default: false,
  },
});

const open = () => {
  loading.value = true;

  // save the current path to redirect back to it after authentication
  useCookie("redirect-path").value = props.redirectPath;

  window.location.href = props.path;
};
</script>
