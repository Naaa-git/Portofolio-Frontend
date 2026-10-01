import { defineStore } from 'pinia'
import { projectService } from '~/services/projectService'
import type { Project } from '~/types'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const selectedCategory = ref<string>('All')

  const featuredProjects = computed(() => projects.value.filter(p => p.featured))
  const categories = computed(() => ['All', ...projectService.getCategories()])
  const filteredProjects = computed(() => {
    if (selectedCategory.value === 'All') return projects.value
    return projects.value.filter(p => p.category === selectedCategory.value)
  })

  function loadProjects() {
    projects.value = projectService.getAll()
  }

  function setCategory(category: string) {
    selectedCategory.value = category
  }

  function getBySlug(slug: string) {
    return projectService.getBySlug(slug)
  }

  return {
    projects,
    selectedCategory,
    featuredProjects,
    categories,
    filteredProjects,
    loadProjects,
    setCategory,
    getBySlug,
  }
})
