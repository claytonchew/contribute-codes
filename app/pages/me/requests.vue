<template>
  <div>
    <div class="py-16">
      <UContainer>
        <div class="space-y-8">
          <div>
            <h1 class="text-xl font-semibold">Requests</h1>
            <span class="mt-1 block text-gray-600 dark:text-gray-300">
              Manage all requests from other users.
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
    label: "Contributors",
    icon: "heroicons:user-plus",
    to: "/me/requests/contributors",
    exact: true,
  },
  {
    label: "Volunteers",
    icon: "heroicons:user-group",
    to: "/me/requests/volunteers",
    exact: true,
  },
];

if (useRoute().path === "/me/requests") {
  navigateTo("/me/requests/contributors");
}
</script>
