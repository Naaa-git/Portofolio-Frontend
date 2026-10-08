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
    title: '', slug: '', shortDescription: { id: '', en: '' }, longDescription: { id: '', en: '' }, techStack: [],
    imageUrl: '', githubUrl: '', demoUrl: '', featured: false, category: { id: '', en: '' },
  }
}

const form = reactive<Omit<ProjectAdmin, 'id'>>(emptyForm())

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showModal.value = true
}

function openEdit(row: ProjectAdmin) {
  editingId.value = row.id
  Object.assign(form, {
    title: row.title, slug: row.slug, shortDescription: { ...row.shortDescription }, longDescription: { ...row.longDescription },
    techStack: [...row.techStack], imageUrl: row.imageUrl, githubUrl: row.githubUrl, demoUrl: row.demoUrl,
    featured: row.featured, category: { ...row.category },
  })
  showModal.value = true
}

async function handleSubmit() {
  try {
    if (editingId.value !== null) {
      await projectStore.updateProject(editingId.value, { ...form })
      toast.success('Project berhasil diperbarui.')
    } else {
      await projectStore.addProject({ ...form })
      toast.success('Project berhasil ditambahkan.')
    }
    showModal.value = false
  } catch {
    toast.error('Gagal menyimpan. Pastikan kamu masih login dan backend berjalan.')
  }
}

async function confirmDelete() {
  if (deleteTarget.value) {
    try {
      await projectStore.deleteProject(deleteTarget.value.id)
      toast.success('Project berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus. Pastikan kamu masih login dan backend berjalan.')
    }
  }
  deleteTarget.value = null
}

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'
const labelClass = 'block text-sm font-medium mb-1.5'
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

    <AdminTable :headers="['Title', 'Category (ID / EN)', 'Featured', '']" :is-empty="projectStore.adminProjects.length === 0">
      <tr v-for="row in projectStore.adminProjects" :key="row.id">
        <td class="px-4 py-3">
          <div class="font-medium">{{ row.title }}</div>
          <div class="text-xs text-slate-500">{{ row.slug }}</div>
        </td>
        <td class="px-4 py-3"><AppBadge variant="accent">{{ row.category.id }} / {{ row.category.en }}</AppBadge></td>
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
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label :class="labelClass">Title</label>
            <input v-model="form.title" type="text" required :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass">Slug</label>
            <input v-model="form.slug" type="text" required :class="inputClass" />
          </div>
        </div>

        <AdminTranslatableInput v-model="form.shortDescription" label="Short Description" type="textarea" :rows="2" required />
        <AdminTranslatableInput v-model="form.longDescription" label="Long Description" type="textarea" :rows="4" required />

        <div>
          <label :class="labelClass">Tech Stack</label>
          <AdminTagInput v-model="form.techStack" placeholder="Tambah teknologi..." />
        </div>

        <div>
          <label :class="labelClass">Image</label>
          <AdminImageUploadField v-model="form.imageUrl" />
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label :class="labelClass">GitHub URL</label>
            <input v-model="form.githubUrl" type="text" :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass">Demo URL</label>
            <input v-model="form.demoUrl" type="text" :class="inputClass" />
          </div>
        </div>

        <AdminTranslatableInput v-model="form.category" label="Category" required />

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
