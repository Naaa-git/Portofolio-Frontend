<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

const profileStore = useProfileStore()
const projectStore = useProjectStore()
await callOnce('projects-data', () => projectStore.loadProjects())

useHead({
  title: `Projects — ${profileStore.profile.name}`,
  meta: [{ name: 'description', content: 'Explore my projects — fullstack web applications built with .NET, Vue.js, React, and more.' }],
})

const searchInput = ref('')
let debounceTimer: ReturnType<typeof setTimeout>
watch(searchInput, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => projectStore.search(value), 300)
})

function clearSearch() {
  searchInput.value = ''
  projectStore.search('')
}

const isSearchActive = computed(() => projectStore.searchQuery.trim().length > 0)
</script>

<template>
  <div class="section-padding">
    <div class="container-max">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ $t('projects.heading') }}</h1>
        <p class="text-slate-600 dark:text-slate-400 text-lg max-w-xl">
          {{ $t('projects.subheading') }}
        </p>
      </div>

      <!-- Search -->
      <div class="relative mb-6 max-w-md">
        <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="searchInput"
          type="text"
          :placeholder="$t('projects.searchPlaceholder')"
          class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
        />
        <button v-if="searchInput" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent-500" @click="clearSearch">
          <X :size="15" />
        </button>
      </div>

      <!-- Filter (hidden while searching — search already cuts across categories) -->
      <div v-if="!isSearchActive" class="flex flex-wrap gap-2 mb-10">
        <button
          v-for="cat in projectStore.categories"
          :key="cat"
          :class="[
            'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
            projectStore.selectedCategory === cat
              ? 'bg-accent-500 text-white'
              : 'glass text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
          ]"
          @click="projectStore.setCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>
      <div v-else class="mb-10 text-sm text-slate-500 dark:text-slate-400">
        {{ projectStore.isSearching ? $t('projects.searching') : $t('projects.searchResultsFor', { query: projectStore.searchQuery }) }}
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          v-for="(project, i) in isSearchActive ? projectStore.searchResults : projectStore.filteredProjects"
          :key="project.id"
          :project="project"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { delay: i * 80 } }"
        />
      </div>

      <div
        v-if="(isSearchActive ? projectStore.searchResults : projectStore.filteredProjects).length === 0 && !projectStore.isSearching"
        class="text-center py-20 text-slate-500"
      >
        {{ isSearchActive ? $t('projects.noSearchResults') : $t('projects.noProjects') }}
      </div>
    </div>
  </div>
</template>
