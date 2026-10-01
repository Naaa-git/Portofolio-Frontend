import { apiFetch } from './apiClient'
import type { Project } from '~/types'

export const projectService = {
  getAll: () => apiFetch<Project[]>('/projects'),
  getBySlug: (slug: string) => apiFetch<Project>(`/projects/${slug}`),
  create: (dto: Omit<Project, 'id'>) => apiFetch<Project>('/projects', { method: 'POST', body: dto }),
  update: (id: number, dto: Omit<Project, 'id'>) => apiFetch<void>(`/projects/${id}`, { method: 'PUT', body: dto }),
  remove: (id: number) => apiFetch<void>(`/projects/${id}`, { method: 'DELETE' }),
}
