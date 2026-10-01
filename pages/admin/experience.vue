<script setup lang="ts">
import { Plus, Pencil, Trash2, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { Experience } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Experience — Admin' })

const profileStore = useProfileStore()

const showModal = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<Omit<Experience, 'id'>>({
  company: '', role: '', type: '', period: '', location: '', current: false, description: [], skills: [],
})
const deleteTarget = ref<Experience | null>(null)

function emptyForm(): Omit<Experience, 'id'> {
  return { company: '', role: '', type: '', period: '', location: '', current: false, description: [], skills: [] }
}

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showModal.value = true
}

function openEdit(row: Experience) {
  editingId.value = row.id
  Object.assign(form, {
    company: row.company, role: row.role, type: row.type, period: row.period, location: row.location,
    current: row.current, description: [...row.description], skills: [...row.skills],
  })
  showModal.value = true
}

function addDescriptionLine() {
  form.description.push('')
}

function removeDescriptionLine(index: number) {
  form.description.splice(index, 1)
}

async function handleSubmit() {
  const payload = { ...form, description: form.description.filter(d => d.trim() !== '') }
  try {
    if (editingId.value !== null) {
      await profileStore.updateExperience(editingId.value, payload)
      toast.success('Experience berhasil diperbarui.')
    } else {
      await profileStore.addExperience(payload)
      toast.success('Experience berhasil ditambahkan.')
    }
    showModal.value = false
  } catch {
    toast.error('Gagal menyimpan. Pastikan kamu masih login dan backend berjalan.')
  }
}

async function confirmDelete() {
  if (deleteTarget.value) {
    try {
      await profileStore.deleteExperience(deleteTarget.value.id)
      toast.success('Experience berhasil dihapus.')
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
        <h1 class="text-2xl font-bold mb-1">Experience</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Riwayat pekerjaan yang tampil di halaman About.</p>
      </div>
      <AppButton size="sm" @click="openCreate"><Plus :size="16" /> Tambah</AppButton>
    </div>

    <AdminTable :headers="['Company', 'Role', 'Period', 'Status', '']" :is-empty="profileStore.experiences.length === 0">
      <tr v-for="row in profileStore.experiences" :key="row.id">
        <td class="px-4 py-3 font-medium">{{ row.company }}</td>
        <td class="px-4 py-3 text-slate-500">{{ row.role }}</td>
        <td class="px-4 py-3 text-slate-500">{{ row.period }}</td>
        <td class="px-4 py-3"><AppBadge v-if="row.current" variant="success">Current</AppBadge></td>
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

    <AdminModal :show="showModal" :title="editingId !== null ? 'Edit Experience' : 'Tambah Experience'" @close="showModal = false">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label :class="labelClass">Company</label>
            <input v-model="form.company" type="text" required :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass">Role</label>
            <input v-model="form.role" type="text" required :class="inputClass" />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label :class="labelClass">Type</label>
            <input v-model="form.type" type="text" placeholder="Full-time, Part-time..." required :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass">Period</label>
            <input v-model="form.period" type="text" placeholder="Jul 2024 – Present" required :class="inputClass" />
          </div>
        </div>

        <div>
          <label :class="labelClass">Location</label>
          <input v-model="form.location" type="text" required :class="inputClass" />
        </div>

        <AdminToggleSwitch v-model="form.current" label="Posisi saat ini (current)" />

        <div>
          <label :class="labelClass">Description</label>
          <div class="space-y-2">
            <div v-for="(_, index) in form.description" :key="index" class="flex gap-2">
              <input v-model="form.description[index]" type="text" :class="inputClass" />
              <button type="button" class="shrink-0 p-2 text-slate-400 hover:text-red-500" @click="removeDescriptionLine(index)">
                <X :size="16" />
              </button>
            </div>
          </div>
          <button type="button" class="mt-2 text-sm text-accent-500 hover:underline" @click="addDescriptionLine">
            + Tambah poin
          </button>
        </div>

        <div>
          <label :class="labelClass">Skills</label>
          <AdminTagInput v-model="form.skills" placeholder="Tambah skill..." />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <AppButton type="button" variant="ghost" size="sm" @click="showModal = false">Batal</AppButton>
          <AppButton type="submit" size="sm">Simpan</AppButton>
        </div>
      </form>
    </AdminModal>

    <AdminConfirmDialog
      :show="!!deleteTarget"
      :message="`Hapus experience di '${deleteTarget?.company}'?`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
