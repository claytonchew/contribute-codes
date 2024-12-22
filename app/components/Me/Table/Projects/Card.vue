<template>
  <ULink :to="`/project/${props.project.id}`" class="group">
    <UCard
      :ui="{
        base: 'flex flex-col h-full',
        divide: 'divide-y-0',
        header: { padding: 'pb-6' },
        body: { base: 'flex-1' },
        footer: { padding: 'pt-0' },
        ring: 'group-hover:ring-primary-500 dark:group-hover:ring-primary-600',
      }">
      <template #header>
        <p class="line-clamp-1 font-semibold">
          {{ props.project.title }}
        </p>
        <p class="line-clamp-2 text-sm">
          {{ props.project.snippet }}
        </p>
      </template>

      <template #footer>
        <div class="flex justify-start gap-6">
          <div class="flex-shrink-0 space-y-1">
            <span class="block text-sm text-gray-500 dark:text-gray-400">
              Created
            </span>
            <span class="block py-0.5 text-sm">
              {{
                new Date(props.project.createdAt).toLocaleDateString("en", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              }}
            </span>
          </div>
          <div class="space-y-1">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Skills Wanted
            </span>
            <div class="flex flex-wrap gap-1">
              <UBadge
                v-for="skill in props.project.skills.slice(0, 3)"
                :key="skill"
                color="white"
                :ui="{ rounded: 'rounded-full' }">
                {{ skill }}
              </UBadge>
              <UBadge
                v-if="props.project.skills.length > 3"
                color="white"
                :ui="{ rounded: 'rounded-full' }">
                +{{ props.project.skills.length - 3 }}
              </UBadge>
            </div>
          </div>
          <div class="flex-shrink-0 space-y-1">
            <span class="block text-sm text-gray-500 dark:text-gray-400">
              Published
            </span>
            <UIcon
              :name="
                props.project.isPublished
                  ? 'heroicons:check-circle-solid'
                  : 'heroicons:x-circle-solid'
              "
              class="h-6 w-6"
              :class="{
                'text-green-500 dark:text-green-400': props.project.isPublished,
                'text-gray-400 dark:text-gray-600': !props.project.isPublished,
              }"
              size="lg" />
          </div>
        </div>
      </template>
    </UCard>
  </ULink>
</template>

<script setup lang="ts">
const props = defineProps<{
  project: {
    id: string;
    createdAt: string;
    title: string;
    snippet: string;
    skills: string[];
    isPublished: boolean;
  };
}>();
</script>
