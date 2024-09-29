<template>
  <footer>
    <div class="border-t border-gray-200 dark:border-gray-800">
      <UContainer
        class="py-8 lg:flex lg:items-center lg:justify-between lg:gap-x-3 lg:py-4">
        <!-- right -->
        <div class="mt-3 flex items-center justify-center lg:order-2 lg:mt-0">
          <ul class="flex flex-row items-center justify-center gap-4 lg:gap-6">
            <li v-for="(link, index) in links" :key="index">
              <ULink
                :to="link.to"
                class="flex items-center gap-1 text-sm font-medium"
                active-class="text-primary"
                inactive-class="hover:text-primary">
                {{ link.label }}
              </ULink>
            </li>
          </ul>
        </div>
        <!-- left -->
        <div
          class="mt-3 flex items-center justify-center gap-x-1.5 lg:order-1 lg:mt-0 lg:flex-1 lg:justify-start">
          <span class="text-center text-sm text-gray-500 dark:text-gray-400">
            © contribute.codes {{ new Date().getFullYear() }}, made by
            <ULink
              to="https://github.com/claytonchew"
              class="hover:text-primary underline underline-offset-4"
              target="_blank">
              @claytonchew</ULink
            >. Check out the
            <ULink
              to="https://github.com/claytonchew/contribute-codes"
              class="hover:text-primary underline underline-offset-4"
              target="_blank">
              repo</ULink
            >.
          </span>
        </div>
      </UContainer>
    </div>
  </footer>
</template>

<script setup lang="ts">
const links = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
];
</script>
