import { apiFetch } from './apiClient'
import type { Project, ProjectAdmin } from '~/types'

export const projectService = {
  getAll: () => apiFetch<Project[]>('/projects'),
  getBySlug: (slug: string) => apiFetch<Project>(`/projects/${slug}`),
  search: (q: string) => apiFetch<Project[]>(`/projects/search?q=${encodeURIComponent(q)}`),
  getAllAdmin: () => apiFetch<ProjectAdmin[]>('/projects/admin'),
  create: (dto: Omit<ProjectAdmin, 'id'>) => apiFetch<ProjectAdmin>('/projects', { method: 'POST', body: dto }),
  update: (id: number, dto: Omit<ProjectAdmin, 'id'>) => apiFetch<void>(`/projects/${id}`, { method: 'PUT', body: dto }),
  remove: (id: number) => apiFetch<void>(`/projects/${id}`, { method: 'DELETE' }),
}
