import { defineStore } from 'pinia'
import { projectService } from '~/services/projectService'
import type { Project } from '~/types'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const selectedCategory = ref<string>('All')
  const isLoaded = ref(false)

  const featuredProjects = computed(() => projects.value.filter(p => p.featured))
  const categories = computed(() => ['All', ...new Set(projects.value.map(p => p.category))])
  const filteredProjects = computed(() => {
    if (selectedCategory.value === 'All') return projects.value
    return projects.value.filter(p => p.category === selectedCategory.value)
  })

  async function loadProjects() {
    if (isLoaded.value) return
    projects.value = await projectService.getAll()
    isLoaded.value = true
  }

  function setCategory(category: string) {
    selectedCategory.value = category
  }

  async function getBySlug(slug: string) {
    return await projectService.getBySlug(slug)
  }

  async function addProject(dto: Omit<Project, 'id'>) {
    projects.value.push(await projectService.create(dto))
  }

  async function updateProject(id: number, dto: Omit<Project, 'id'>) {
    await projectService.update(id, dto)
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) projects.value[index] = { id, ...dto }
  }

  async function deleteProject(id: number) {
    await projectService.remove(id)
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
