<template>
  <UContainer
    class="flex flex-col divide-y divide-gray-200 lg:min-h-[calc(100vh-var(--header-height))] lg:flex-row lg:divide-x dark:divide-gray-800"
    :ui="{ strategy: 'override', padding: 'px-0 lg:px-8' }">
    <div class="grow px-6 py-8 lg:px-0 lg:pr-6">
      <slot name="main" />
    </div>

    <aside
      class="w-full flex-shrink-0 space-y-8 px-6 py-8 lg:max-w-xs lg:px-0 lg:py-6 lg:pl-4">
      <slot name="aside" />
    </aside>

    <slot />
  </UContainer>
</template>
