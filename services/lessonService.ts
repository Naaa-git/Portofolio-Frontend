import { apiFetch } from './apiClient'
import type { Lesson, LessonAdmin, LessonCategory, LessonCategoryAdmin } from '~/types'

export const lessonCategoryService = {
  getAll: () => apiFetch<LessonCategory[]>('/lesson-categories'),
  getAllAdmin: () => apiFetch<LessonCategoryAdmin[]>('/lesson-categories/admin'),
  create: (dto: Omit<LessonCategoryAdmin, 'id'>) => apiFetch<LessonCategoryAdmin>('/lesson-categories', { method: 'POST', body: dto }),
  update: (id: number, dto: Omit<LessonCategoryAdmin, 'id'>) => apiFetch<void>(`/lesson-categories/${id}`, { method: 'PUT', body: dto }),
  remove: (id: number) => apiFetch<void>(`/lesson-categories/${id}`, { method: 'DELETE' }),
}

export const lessonService = {
  getAll: () => apiFetch<Lesson[]>('/lessons'),
  getAllAdmin: () => apiFetch<LessonAdmin[]>('/lessons/admin'),
  create: (dto: Omit<LessonAdmin, 'id'>) => apiFetch<LessonAdmin>('/lessons', { method: 'POST', body: dto }),
  update: (id: number, dto: Omit<LessonAdmin, 'id'>) => apiFetch<void>(`/lessons/${id}`, { method: 'PUT', body: dto }),
  remove: (id: number) => apiFetch<void>(`/lessons/${id}`, { method: 'DELETE' }),
}
