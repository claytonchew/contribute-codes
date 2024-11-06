<template>
  <ULink :to="`/project/${props.project.id}`" class="group">
    <UCard
      :ui="{
        base: 'flex flex-col h-full',
        divide: 'divide-y-0',
        header: { padding: 'pb-0' },
        body: { base: 'flex-1' },
        footer: { padding: 'pt-0' },
        ring: 'group-hover:ring-primary-500 dark:group-hover:ring-primary-600',
      }">
      <template #header>
        <p class="line-clamp-2 font-semibold">
          {{ props.project.title }}
        </p>
      </template>

      <p class="line-clamp-3 text-sm">
        {{ props.project.snippet }}
      </p>

      <template #footer>
        <div class="space-y-1">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Skills Wanted
          </span>
          <div class="flex gap-1">
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
      </template>
    </UCard>
  </ULink>
</template>

<script setup lang="ts">
const props = defineProps<{
  project: {
    id: string;
    title: string;
    snippet: string;
    skills: string[];
  };
}>();
</script>
