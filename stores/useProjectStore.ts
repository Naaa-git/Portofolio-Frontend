import { defineStore } from 'pinia'
import { projectService } from '~/services/projectService'
import type { Project } from '~/types'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const selectedCategory = ref<string>('All')

  const featuredProjects = computed(() => projects.value.filter(p => p.featured))
  const categories = computed(() => ['All', ...new Set(projects.value.map(p => p.category))])
  const filteredProjects = computed(() => {
    if (selectedCategory.value === 'All') return projects.value
    return projects.value.filter(p => p.category === selectedCategory.value)
  })

  function loadProjects() {
    if (projects.value.length === 0) {
      projects.value = projectService.getAll()
    }
  }

  function setCategory(category: string) {
    selectedCategory.value = category
  }

  function getBySlug(slug: string) {
    return projects.value.find(p => p.slug === slug)
  }

  function nextId() {
    return projects.value.length ? Math.max(...projects.value.map(p => p.id)) + 1 : 1
  }

  function addProject(project: Omit<Project, 'id'>) {
    projects.value.push({ id: nextId(), ...project })
  }

  function updateProject(id: number, project: Omit<Project, 'id'>) {
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) projects.value[index] = { id, ...project }
  }

  function deleteProject(id: number) {
    projects.value = projects.value.filter(p => p.id !== id)
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
    addProject,
    updateProject,
    deleteProject,
  }
})
