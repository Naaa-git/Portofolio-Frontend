<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import type { Project } from '~/types'

interface Props {
  project: Project
  variant?: 'default' | 'featured'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.slug}`"
    :class="[
      'group glass rounded-2xl overflow-hidden block',
      'hover:border-accent-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-500/10',
      'transition-all duration-300',
    ]"
  >
    <!-- Image -->
    <div class="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
      <NuxtImg
        :src="project.imageUrl"
        :alt="project.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <span class="glass px-2.5 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
          View <ArrowUpRight :size="12" />
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent-500 transition-colors line-clamp-1">
          {{ project.title }}
        </h3>
        <AppBadge variant="muted" class="shrink-0">{{ project.category }}</AppBadge>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
        {{ project.shortDescription }}
      </p>
      <div class="flex flex-wrap gap-1.5">
        <AppBadge v-for="tech in project.techStack.slice(0, 4)" :key="tech" variant="default">
          {{ tech }}
        </AppBadge>
        <AppBadge v-if="project.techStack.length > 4" variant="muted">
          +{{ project.techStack.length - 4 }}
        </AppBadge>
      </div>
    </div>
  </NuxtLink>
</template>
