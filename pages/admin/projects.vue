<script setup lang="ts">
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { ProjectAdmin } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Projects — Admin' })

const projectStore = useProjectStore()
await callOnce('projects-admin-data', () => projectStore.loadAdminProjects())

const showModal = ref(false)
const editingId = ref<number | null>(null)
const deleteTarget = ref<ProjectAdmin | null>(null)

function emptyForm(): Omit<ProjectAdmin, 'id'> {
  return {
    title: '', slug: '', shortDescription: { id: '', en: '' }, contribution: [], techStack: [],
    imageUrl: '', githubUrl: null, demoUrl: null, featured: false, category: 'Personal',
  }
}

const form = reactive<Omit<ProjectAdmin, 'id'>>(emptyForm())

const errors = reactive<Record<string, string | undefined>>({})

function validate(): boolean {
  errors.title = requiredError(form.title, 'Title')
  errors.slug = slugError(form.slug, 'Slug')
  errors.shortDescriptionId = requiredError(form.shortDescription.id, 'Short Description (Indonesia)')
  errors.shortDescriptionEn = requiredError(form.shortDescription.en, 'Short Description (English)')
  errors.imageUrl = urlError(form.imageUrl, 'Image', { required: true })
  errors.githubUrl = urlError(form.githubUrl ?? '', 'GitHub URL')
  errors.demoUrl = urlError(form.demoUrl ?? '', 'Demo URL')
  return !Object.values(errors).some(Boolean)
}

watch(() => form.title, () => { errors.title = undefined })
watch(() => form.slug, () => { errors.slug = undefined })
watch(() => form.shortDescription.id, () => { errors.shortDescriptionId = undefined })
watch(() => form.shortDescription.en, () => { errors.shortDescriptionEn = undefined })
watch(() => form.imageUrl, () => { errors.imageUrl = undefined })
watch(() => form.githubUrl, () => { errors.githubUrl = undefined })
watch(() => form.demoUrl, () => { errors.demoUrl = undefined })

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  Object.keys(errors).forEach(k => { errors[k] = undefined })
  showModal.value = true
}

function openEdit(row: ProjectAdmin) {
  editingId.value = row.id
  Object.assign(form, {
    title: row.title, slug: row.slug, shortDescription: { ...row.shortDescription }, contribution: [...row.contribution],
    techStack: [...row.techStack], imageUrl: row.imageUrl, githubUrl: row.githubUrl, demoUrl: row.demoUrl,
    featured: row.featured, category: row.category,
  })
  Object.keys(errors).forEach(k => { errors[k] = undefined })
  showModal.value = true
}

async function handleSubmit() {
  if (!validate()) return
  try {
    if (editingId.value !== null) {
      await projectStore.updateProject(editingId.value, { ...form })
      toast.success('Project berhasil diperbarui.')
    } else {
      await projectStore.addProject({ ...form })
      toast.success('Project berhasil ditambahkan.')
    }
    showModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan. Pastikan kamu masih login dan backend berjalan.'))
  }
}

async function confirmDelete() {
  if (deleteTarget.value) {
    try {
      await projectStore.deleteProject(deleteTarget.value.id)
      toast.success('Project berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus. Pastikan kamu masih login dan backend berjalan.'))
    }
  }
  deleteTarget.value = null
}

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'

const categoryLabels: Record<ProjectAdmin['category'], string> = {
  Personal: 'Personal',
  Freelance: 'Freelance',
  Work: 'Pekerjaan Kantor',
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold mb-1">Projects</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Daftar project yang tampil di halaman Projects.</p>
      </div>
      <AppButton size="sm" @click="openCreate"><Plus :size="16" /> Tambah</AppButton>
    </div>

    <AdminTable :headers="['Title', 'Category', 'Featured', '']" :is-empty="projectStore.adminProjects.length === 0">
      <tr v-for="row in projectStore.adminProjects" :key="row.id">
        <td class="px-4 py-3">
          <div class="font-medium">{{ row.title }}</div>
          <div class="text-xs text-slate-500">{{ row.slug }}</div>
        </td>
        <td class="px-4 py-3"><AppBadge variant="accent">{{ categoryLabels[row.category] }}</AppBadge></td>
        <td class="px-4 py-3"><AppBadge v-if="row.featured" variant="success">Featured</AppBadge></td>
        <td class="px-4 py-3">
          <div class="flex justify-end gap-1">
            <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openEdit(row)">
              <Pencil :size="15" />
            </button>
            <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="deleteTarget = row">
              <Trash2 :size="15" />
            </button>
          </div>
        </td>
      </tr>
    </AdminTable>

    <AdminModal :show="showModal" :title="editingId !== null ? 'Edit Project' : 'Tambah Project'" @close="showModal = false">
      <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <AdminLabel text="Title" required />
            <input v-model="form.title" type="text" maxlength="150" :class="errorInputClass(inputClass, errors.title)" />
            <AdminFieldError :message="errors.title" />
          </div>
          <div>
            <AdminLabel text="Slug" required />
            <input v-model="form.slug" type="text" maxlength="150" :class="errorInputClass(inputClass, errors.slug)" />
            <AdminFieldError :message="errors.slug" />
          </div>
        </div>

        <AdminTranslatableInput
          v-model="form.shortDescription" label="Short Description" type="textarea" :rows="2" required :maxlength="300"
          :error-id="errors.shortDescriptionId" :error-en="errors.shortDescriptionEn"
        />

        <div>
          <AdminLabel text="Contribution" />
          <AdminTranslatableListInput v-model="form.contribution" type="textarea" :maxlength="500" />
        </div>

        <div>
          <AdminLabel text="Tech Stack" />
          <AdminTagInput v-model="form.techStack" placeholder="Tambah teknologi..." />
        </div>

        <div>
          <AdminLabel text="Image" required />
          <AdminFileUploadField v-model="form.imageUrl" accept="image/*" endpoint="/images/upload" kind="image" :aspect-ratio="16 / 9" />
          <AdminFieldError :message="errors.imageUrl" />
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <AdminLabel text="GitHub URL" />
            <input v-model="form.githubUrl" type="url" maxlength="500" :class="errorInputClass(inputClass, errors.githubUrl)" />
            <AdminFieldError :message="errors.githubUrl" />
          </div>
          <div>
            <AdminLabel text="Demo URL" />
            <input v-model="form.demoUrl" type="url" maxlength="500" :class="errorInputClass(inputClass, errors.demoUrl)" />
            <AdminFieldError :message="errors.demoUrl" />
          </div>
        </div>

        <div>
          <AdminLabel text="Category" />
          <select v-model="form.category" :class="inputClass">
            <option value="Personal">Personal</option>
            <option value="Freelance">Freelance</option>
            <option value="Work">Pekerjaan Kantor</option>
          </select>
        </div>

        <AdminToggleSwitch v-model="form.featured" label="Featured" />

        <div class="flex justify-end gap-2 pt-2">
          <AppButton type="button" variant="ghost" size="sm" @click="showModal = false">Batal</AppButton>
          <AppButton type="submit" size="sm">Simpan</AppButton>
        </div>
      </form>
    </AdminModal>

    <AdminConfirmDialog
      :show="!!deleteTarget"
      :message="`Hapus project '${deleteTarget?.title}'?`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
