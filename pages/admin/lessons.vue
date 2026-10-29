<script setup lang="ts">
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { LessonAdmin, LessonCategoryAdmin } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Lessons & Experiments — Admin' })

const lessonStore = useLessonStore()
const projectStore = useProjectStore()
const profileStore = useProfileStore()

await callOnce('lessons-admin-data', () => Promise.all([
  lessonStore.loadAllAdmin(),
  projectStore.loadAdminProjects(),
  profileStore.loadAdmin(),
]))

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'

function categoryName(id: number) {
  return lessonStore.adminCategories.find(c => c.id === id)?.name.id ?? '—'
}

// --- Categories ---
const showCategoryModal = ref(false)
const editingCategoryId = ref<number | null>(null)
const deleteCategoryTarget = ref<LessonCategoryAdmin | null>(null)

function emptyCategoryForm(): Omit<LessonCategoryAdmin, 'id'> {
  return { name: { id: '', en: '' }, sortOrder: 0 }
}

const categoryForm = reactive<Omit<LessonCategoryAdmin, 'id'>>(emptyCategoryForm())

const categoryErrors = reactive<Record<string, string | undefined>>({})

function validateCategory(): boolean {
  categoryErrors.nameId = requiredError(categoryForm.name.id, 'Nama Kategori (Indonesia)')
  categoryErrors.nameEn = requiredError(categoryForm.name.en, 'Nama Kategori (English)')
  return !Object.values(categoryErrors).some(Boolean)
}

watch(() => categoryForm.name.id, () => { categoryErrors.nameId = undefined })
watch(() => categoryForm.name.en, () => { categoryErrors.nameEn = undefined })

function openCategoryCreate() {
  editingCategoryId.value = null
  Object.assign(categoryForm, emptyCategoryForm())
  Object.keys(categoryErrors).forEach(k => { categoryErrors[k] = undefined })
  showCategoryModal.value = true
}

function openCategoryEdit(row: LessonCategoryAdmin) {
  editingCategoryId.value = row.id
  Object.assign(categoryForm, { name: { ...row.name }, sortOrder: row.sortOrder })
  Object.keys(categoryErrors).forEach(k => { categoryErrors[k] = undefined })
  showCategoryModal.value = true
}

async function submitCategory() {
  if (!validateCategory()) return
  try {
    if (editingCategoryId.value !== null) {
      await lessonStore.updateCategory(editingCategoryId.value, { ...categoryForm })
      toast.success('Kategori berhasil diperbarui.')
    } else {
      await lessonStore.addCategory({ ...categoryForm })
      toast.success('Kategori berhasil ditambahkan.')
    }
    showCategoryModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan kategori.'))
  }
}

async function confirmCategoryDelete() {
  if (deleteCategoryTarget.value) {
    try {
      await lessonStore.deleteCategory(deleteCategoryTarget.value.id)
      toast.success('Kategori berhasil dihapus.')
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast.error('Kategori ini masih dipakai Lesson lain. Pindahkan atau hapus Lesson-nya dulu.')
      } else {
        toast.error('Gagal menghapus kategori.')
      }
    }
  }
  deleteCategoryTarget.value = null
}

// --- Lessons ---
const showLessonModal = ref(false)
const editingLessonId = ref<number | null>(null)
const deleteLessonTarget = ref<LessonAdmin | null>(null)

function emptyLessonForm(): Omit<LessonAdmin, 'id'> {
  return {
    categoryId: lessonStore.adminCategories[0]?.id ?? 0,
    title: { id: '', en: '' },
    description: { id: '', en: '' },
    projectId: null,
    experienceId: null,
  }
}

const lessonForm = reactive<Omit<LessonAdmin, 'id'>>(emptyLessonForm())

const lessonErrors = reactive<Record<string, string | undefined>>({})

function validateLesson(): boolean {
  lessonErrors.titleId = requiredError(lessonForm.title.id, 'Title (Indonesia)')
  lessonErrors.titleEn = requiredError(lessonForm.title.en, 'Title (English)')
  lessonErrors.descriptionId = requiredError(lessonForm.description.id, 'Description (Indonesia)')
  lessonErrors.descriptionEn = requiredError(lessonForm.description.en, 'Description (English)')
  return !Object.values(lessonErrors).some(Boolean)
}

watch(() => lessonForm.title.id, () => { lessonErrors.titleId = undefined })
watch(() => lessonForm.title.en, () => { lessonErrors.titleEn = undefined })
watch(() => lessonForm.description.id, () => { lessonErrors.descriptionId = undefined })
watch(() => lessonForm.description.en, () => { lessonErrors.descriptionEn = undefined })

function openLessonCreate() {
  editingLessonId.value = null
  Object.assign(lessonForm, emptyLessonForm())
  Object.keys(lessonErrors).forEach(k => { lessonErrors[k] = undefined })
  showLessonModal.value = true
}

function openLessonEdit(row: LessonAdmin) {
  editingLessonId.value = row.id
  Object.assign(lessonForm, {
    categoryId: row.categoryId, title: { ...row.title }, description: { ...row.description },
    projectId: row.projectId, experienceId: row.experienceId,
  })
  Object.keys(lessonErrors).forEach(k => { lessonErrors[k] = undefined })
  showLessonModal.value = true
}

async function submitLesson() {
  if (!validateLesson()) return
  try {
    if (editingLessonId.value !== null) {
      await lessonStore.updateLesson(editingLessonId.value, { ...lessonForm })
      toast.success('Lesson berhasil diperbarui.')
    } else {
      await lessonStore.addLesson({ ...lessonForm })
      toast.success('Lesson berhasil ditambahkan.')
    }
    showLessonModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan lesson.'))
  }
}

async function confirmLessonDelete() {
  if (deleteLessonTarget.value) {
    try {
      await lessonStore.deleteLesson(deleteLessonTarget.value.id)
      toast.success('Lesson berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus lesson.'))
    }
  }
  deleteLessonTarget.value = null
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold mb-1">Kategori Lesson</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Kelola kategori buat ngegrupin Lessons & Experiments.</p>
        </div>
        <AppButton size="sm" @click="openCategoryCreate"><Plus :size="16" /> Tambah</AppButton>
      </div>

      <AdminTable :headers="['Nama', 'Urutan', '']" :is-empty="lessonStore.adminCategories.length === 0">
        <tr v-for="row in lessonStore.adminCategories" :key="row.id">
          <td class="px-4 py-3">{{ row.name.id }}</td>
          <td class="px-4 py-3">{{ row.sortOrder }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openCategoryEdit(row)">
                <Pencil :size="15" />
              </button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="deleteCategoryTarget = row">
                <Trash2 :size="15" />
              </button>
            </div>
          </td>
        </tr>
      </AdminTable>
    </div>

    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold mb-1">Lessons & Experiments</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Praktik/pengalaman yang mau ditunjukin, dikelompokkan per kategori.</p>
        </div>
        <AppButton size="sm" :disabled="lessonStore.adminCategories.length === 0" @click="openLessonCreate">
          <Plus :size="16" /> Tambah
        </AppButton>
      </div>

      <p v-if="lessonStore.adminCategories.length === 0" class="text-sm text-slate-500">
        Bikin kategori dulu sebelum nambah Lesson.
      </p>

      <AdminTable v-else :headers="['Title', 'Kategori', 'Tag', '']" :is-empty="lessonStore.adminLessons.length === 0">
        <tr v-for="row in lessonStore.adminLessons" :key="row.id">
          <td class="px-4 py-3 font-medium">{{ row.title.id }}</td>
          <td class="px-4 py-3"><AppBadge variant="accent">{{ categoryName(row.categoryId) }}</AppBadge></td>
          <td class="px-4 py-3">
            <AppBadge v-if="row.projectId" variant="default">Project</AppBadge>
            <AppBadge v-if="row.experienceId" variant="default">Experience</AppBadge>
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openLessonEdit(row)">
                <Pencil :size="15" />
              </button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="deleteLessonTarget = row">
                <Trash2 :size="15" />
              </button>
            </div>
          </td>
        </tr>
      </AdminTable>
    </div>

    <AdminModal :show="showCategoryModal" :title="editingCategoryId !== null ? 'Edit Kategori' : 'Tambah Kategori'" @close="showCategoryModal = false">
      <form class="space-y-4" novalidate @submit.prevent="submitCategory">
        <AdminTranslatableInput
          v-model="categoryForm.name" label="Nama Kategori" required :maxlength="100"
          :error-id="categoryErrors.nameId" :error-en="categoryErrors.nameEn"
        />
        <div>
          <AdminLabel text="Urutan" />
          <input v-model.number="categoryForm.sortOrder" type="number" min="0" max="9999" :class="inputClass" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <AppButton type="button" variant="ghost" size="sm" @click="showCategoryModal = false">Batal</AppButton>
          <AppButton type="submit" size="sm">Simpan</AppButton>
        </div>
      </form>
    </AdminModal>

    <AdminModal :show="showLessonModal" :title="editingLessonId !== null ? 'Edit Lesson' : 'Tambah Lesson'" @close="showLessonModal = false">
      <form class="space-y-4" novalidate @submit.prevent="submitLesson">
        <div>
          <AdminLabel text="Kategori" required />
          <select v-model.number="lessonForm.categoryId" :class="inputClass">
            <option v-for="c in lessonStore.adminCategories" :key="c.id" :value="c.id">{{ c.name.id }}</option>
          </select>
        </div>

        <AdminTranslatableInput v-model="lessonForm.title" label="Title" required :maxlength="150" :error-id="lessonErrors.titleId" :error-en="lessonErrors.titleEn" />
        <AdminTranslatableInput
          v-model="lessonForm.description" label="Description" type="textarea" :rows="4" required :maxlength="2000"
          :error-id="lessonErrors.descriptionId" :error-en="lessonErrors.descriptionEn"
        />

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <AdminLabel text="Terkait Project (opsional)" />
            <select v-model="lessonForm.projectId" :class="inputClass">
              <option :value="null">— Tidak ada —</option>
              <option v-for="p in projectStore.adminProjects" :key="p.id" :value="p.id">{{ p.title }}</option>
            </select>
          </div>
          <div>
            <AdminLabel text="Terkait Experience (opsional)" />
            <select v-model="lessonForm.experienceId" :class="inputClass">
              <option :value="null">— Tidak ada —</option>
              <option v-for="e in profileStore.adminExperiences" :key="e.id" :value="e.id">{{ e.company }}</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <AppButton type="button" variant="ghost" size="sm" @click="showLessonModal = false">Batal</AppButton>
          <AppButton type="submit" size="sm">Simpan</AppButton>
        </div>
      </form>
    </AdminModal>

    <AdminConfirmDialog
      :show="!!deleteCategoryTarget"
      :message="`Hapus kategori '${deleteCategoryTarget?.name.id}'?`"
      @confirm="confirmCategoryDelete"
      @cancel="deleteCategoryTarget = null"
    />

    <AdminConfirmDialog
      :show="!!deleteLessonTarget"
      :message="`Hapus lesson '${deleteLessonTarget?.title.id}'?`"
      @confirm="confirmLessonDelete"
      @cancel="deleteLessonTarget = null"
    />
  </div>
</template>
