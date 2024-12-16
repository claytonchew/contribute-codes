<template>
  <div>
    <div class="py-16">
      <UContainer>
        <div class="space-y-8">
          <div>
            <h1 class="text-lg font-semibold sm:text-xl">Requests</h1>
            <span
              class="mt-1 block text-sm text-gray-600 sm:text-base dark:text-gray-300">
              Manage all requests.
            </span>
          </div>
          <UHorizontalNavigation
            :links="links"
            class="border-b border-gray-200 dark:border-gray-800" />

          <NuxtPage />
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Requests",
});

const links = [
  {
    label: "Your Requests",
    icon: "heroicons:identification",
    to: "/me/requests/your-requests",
    exact: true,
  },
  {
    label: "Volunteer Requests",
    icon: "heroicons:user-group",
    to: "/me/requests/volunteer-requests",
    exact: true,
  },
];

if (useRoute().path === "/me/requests") {
  navigateTo("/me/requests/your-requests");
}
</script>
