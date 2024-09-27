<template>
  <header
    class="sticky top-0 z-50 -mb-px border-b border-gray-200 backdrop-blur dark:border-gray-800"
    :class="{
      'bg-background': isMobileMenuOpen,
      'bg-background/75': !isMobileMenuOpen,
    }">
    <UContainer
      class="flex h-[--header-height] items-center justify-between gap-3">
      <!-- logo -->
      <div class="flex items-center gap-1.5 lg:flex-1">
        <ULink to="/" aria-label="Logo">
          <AppLogo />
        </ULink>
        <ColorModeButton />
      </div>

      <!-- links -->
      <ul class="hidden items-center gap-x-8 lg:flex">
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

      <!-- right -->
      <div class="flex items-center justify-end gap-1.5 lg:flex-1">
        <AuthState v-slot="{ loggedIn }">
          <AuthButton
            v-if="!loggedIn"
            label="Sign in with GitHub"
            path="/auth/github"
            icon="simple-icons:github"
            class="hidden lg:inline-flex" />
          <AuthProfileDropdown
            v-else
            :links="userLinks"
            class="hidden lg:inline-flex" />
        </AuthState>

        <UButton
          class="lg:hidden"
          variant="ghost"
          color="gray"
          :aria-label="`${isMobileMenuOpen ? 'Close' : 'Open'} Menu`"
          :icon="
            isMobileMenuOpen
              ? 'heroicons:x-mark-20-solid'
              : 'heroicons:bars-3-20-solid'
          "
          @click="isMobileMenuOpen = !isMobileMenuOpen" />
      </div>
    </UContainer>

    <!-- mobile menu -->
    <div v-if="isMobileMenuOpen">
      <div
        class="bg-background fixed inset-0 top-[calc(var(--header-height)+1px)] z-50 min-h-[calc(100vh-var(--header-height))] overflow-y-auto lg:hidden">
        <UContainer class="flex flex-col justify-between gap-3 py-4">
          <UVerticalNavigation
            :links="links"
            class="w-full"
            :ui="{ size: 'text-md' }"
            @click="isMobileMenuOpen = false" />

          <UDivider class="py-2" />

          <AuthState v-slot="{ loggedIn }">
            <AuthButton
              v-if="!loggedIn"
              label="Sign in with GitHub"
              path="/auth/github"
              icon="simple-icons:github"
              size="lg"
              block />
            <template v-else>
              <AuthProfile />
              <UVerticalNavigation
                :links="userLinks"
                class="w-full"
                :ui="{ size: 'text-md' }"
                @click="isMobileMenuOpen = false" />
            </template>
          </AuthState>
        </UContainer>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const links = [
  { label: "Explore", to: "/" },
  { label: "About", to: "/about" },
  { label: "How to Contribute", to: "/how-to-contribute" },
];

const { clear } = useUserSession();
const toast = useToast();

const userLinks = [
  [
    {
      label: "Sign out",
      icon: "heroicons:arrow-left-end-on-rectangle-16-solid",
      click: async () => {
        await clear();
        toast.add({
          title: "Signed out",
          description: "You have been signed out successfully!",
          color: "primary",
        });
        navigateTo("/");
      },
    },
  ],
];

const isMobileMenuOpen = ref(false);
</script>
