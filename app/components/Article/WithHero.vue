<template>
  <div>
    <ContentDoc>
      <template #default="{ doc }">
        <slot name="hero" :doc="doc">
          <div class="py-12 sm:py-24">
            <UContainer>
              <h1
                class="mx-auto max-w-5xl text-center text-3xl font-semibold sm:text-5xl">
                {{ doc.title }}
              </h1>
              <span
                class="text-md mt-6 block text-center text-gray-600 sm:text-lg dark:text-gray-300">
                {{ doc.description }}
              </span>
            </UContainer>
          </div>
        </slot>

        <article class="pb-12 sm:pb-24">
          <UContainer>
            <ContentRenderer
              :value="doc"
              class="prose dark:prose-invert !max-w-none" />
          </UContainer>
        </article>
      </template>
      <template #not-found>
        <div class="py-24">
          <UContainer>
            <span class="block text-center"
              >Content not found for {{ useRoute().path }}</span
            >
          </UContainer>
        </div>
      </template>
    </ContentDoc>
  </div>
</template>

<script setup lang="ts"></script>
