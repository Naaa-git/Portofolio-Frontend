import { defineStore } from 'pinia'
import { lessonCategoryService, lessonService } from '~/services/lessonService'
import type { Lesson, LessonAdmin, LessonCategory, LessonCategoryAdmin } from '~/types'

export const useLessonStore = defineStore('lessons', () => {
  const categories = ref<LessonCategory[]>([])
  const lessons = ref<Lesson[]>([])
  const isLoaded = ref(false)

  async function loadAll() {
    if (isLoaded.value) return
    const [c, l] = await Promise.all([lessonCategoryService.getAll(), lessonService.getAll()])
    categories.value = c
    lessons.value = l
    isLoaded.value = true
  }

  // --- Admin (raw bilingual dictionaries) ---
  const adminCategories = ref<LessonCategoryAdmin[]>([])
  const adminLessons = ref<LessonAdmin[]>([])
  const isAdminLoaded = ref(false)

  async function loadAllAdmin() {
    if (isAdminLoaded.value) return
    const [c, l] = await Promise.all([lessonCategoryService.getAllAdmin(), lessonService.getAllAdmin()])
    adminCategories.value = c
    adminLessons.value = l
    isAdminLoaded.value = true
  }

  async function addCategory(dto: Omit<LessonCategoryAdmin, 'id'>) {
    adminCategories.value.push(await lessonCategoryService.create(dto))
  }

  async function updateCategory(id: number, dto: Omit<LessonCategoryAdmin, 'id'>) {
    await lessonCategoryService.update(id, dto)
    const index = adminCategories.value.findIndex(c => c.id === id)
    if (index !== -1) adminCategories.value[index] = { id, ...dto }
  }

  async function deleteCategory(id: number) {
    await lessonCategoryService.remove(id)
    adminCategories.value = adminCategories.value.filter(c => c.id !== id)
  }

  async function addLesson(dto: Omit<LessonAdmin, 'id'>) {
    adminLessons.value.push(await lessonService.create(dto))
  }

  async function updateLesson(id: number, dto: Omit<LessonAdmin, 'id'>) {
    await lessonService.update(id, dto)
    const index = adminLessons.value.findIndex(l => l.id === id)
    if (index !== -1) adminLessons.value[index] = { id, ...dto }
  }

  async function deleteLesson(id: number) {
    await lessonService.remove(id)
    adminLessons.value = adminLessons.value.filter(l => l.id !== id)
  }

  return {
    categories,
    lessons,
    loadAll,
    adminCategories,
    adminLessons,
    loadAllAdmin,
    addCategory,
    updateCategory,
    deleteCategory,
    addLesson,
    updateLesson,
    deleteLesson,
  }
})
