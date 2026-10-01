<script setup lang="ts">
useHead({
  title: 'Projects — Pradana Aldi Musthofa',
  meta: [{ name: 'description', content: 'Explore my projects — fullstack web applications built with .NET, Vue.js, React, and more.' }],
})

const projectStore = useProjectStore()
projectStore.loadProjects()
</script>

<template>
  <div class="section-padding">
    <div class="container-max">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
        <p class="text-slate-600 dark:text-slate-400 text-lg max-w-xl">
          A collection of web applications I've built — from enterprise systems to developer tools.
        </p>
      </div>

      <!-- Filter -->
      <div class="flex flex-wrap gap-2 mb-10">
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

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          v-for="(project, i) in projectStore.filteredProjects"
          :key="project.id"
          :project="project"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { delay: i * 80 } }"
        />
      </div>

      <div v-if="projectStore.filteredProjects.length === 0" class="text-center py-20 text-slate-500">
        No projects found in this category.
      </div>
    </div>
  </div>
</template>
