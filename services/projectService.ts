import { projects } from '~/data/projects'
import type { Project } from '~/types'

export const projectService = {
  getAll(): Project[] {
    return projects
  },

  getFeatured(): Project[] {
    return projects.filter(p => p.featured)
  },

  getBySlug(slug: string): Project | undefined {
    return projects.find(p => p.slug === slug)
  },

  getByCategory(category: string): Project[] {
    return projects.filter(p => p.category === category)
  },

  getCategories(): string[] {
    return [...new Set(projects.map(p => p.category))]
  },
}
