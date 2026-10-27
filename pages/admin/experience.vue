<script setup lang="ts">
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { ExperienceAdmin } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Experience — Admin' })

const profileStore = useProfileStore()
const projectStore = useProjectStore()
await callOnce('profile-admin-data', () => profileStore.loadAdmin())
await callOnce('projects-admin-data', () => projectStore.loadAdminProjects())

const showModal = ref(false)
const editingId = ref<number | null>(null)

function emptyForm(): Omit<ExperienceAdmin, 'id'> {
  return {
    company: '', role: { id: '', en: '' }, type: '', startDate: '', endDate: null,
    location: '', current: false, description: { id: '', en: '' }, skills: [], projectIds: [],
  }
}

const form = reactive<Omit<ExperienceAdmin, 'id'>>(emptyForm())
const deleteTarget = ref<ExperienceAdmin | null>(null)

// HTML <input type="month"> works with "YYYY-MM" — the API deals in full
// ISO dates ("YYYY-MM-DD"), so convert at the edges rather than carrying a
// half-formed date around in the form itself.
const startMonth = computed({
  get: () => form.startDate.slice(0, 7),
  set: (v: string) => { form.startDate = v ? `${v}-01` : '' },
})
const endMonth = computed({
  get: () => form.endDate?.slice(0, 7) ?? '',
  set: (v: string) => { form.endDate = v ? `${v}-01` : null },
})

watch(() => form.current, (isCurrent) => {
  if (isCurrent) form.endDate = null
})

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showModal.value = true
}

function openEdit(row: ExperienceAdmin) {
  editingId.value = row.id
  Object.assign(form, {
    company: row.company, role: { ...row.role }, type: row.type, startDate: row.startDate, endDate: row.endDate,
    location: row.location, current: row.current, description: { ...row.description }, skills: [...row.skills],
    projectIds: [...row.projectIds],
  })
  showModal.value = true
}

async function handleSubmit() {
  try {
    if (editingId.value !== null) {
      await profileStore.updateExperience(editingId.value, form)
      await profileStore.setExperienceProjectLinks(editingId.value, form.projectIds)
      toast.success('Experience berhasil diperbarui.')
    } else {
      // Project links need a real id to attach to — create the experience
      // first, link projects right after in the same submit.
      const created = await profileStore.addExperience(form)
      if (form.projectIds.length) await profileStore.setExperienceProjectLinks(created.id, form.projectIds)
      toast.success('Experience berhasil ditambahkan.')
    }
    showModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan. Pastikan kamu masih login dan backend berjalan.'))
  }
}

async function confirmDelete() {
  if (deleteTarget.value) {
    try {
      await profileStore.deleteExperience(deleteTarget.value.id)
      toast.success('Experience berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus. Pastikan kamu masih login dan backend berjalan.'))
    }
  }
  deleteTarget.value = null
}

function toggleProject(id: number) {
  const i = form.projectIds.indexOf(id)
  if (i === -1) form.projectIds.push(id)
  else form.projectIds.splice(i, 1)
}

function formatPeriod(row: ExperienceAdmin) {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `${fmt(row.startDate)} – ${row.current ? 'Present' : fmt(row.endDate!)}`
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

    <AdminTable :headers="['Company', 'Role (ID / EN)', 'Period', 'Status', '']" :is-empty="profileStore.adminExperiences.length === 0">
      <tr v-for="row in profileStore.adminExperiences" :key="row.id">
        <td class="px-4 py-3 font-medium">{{ row.company }}</td>
        <td class="px-4 py-3 text-slate-500">{{ row.role.id }} <span class="text-slate-400">/ {{ row.role.en }}</span></td>
        <td class="px-4 py-3 text-slate-500">{{ formatPeriod(row) }}</td>
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
            <input v-model="form.company" type="text" required maxlength="150" :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass">Type</label>
            <input v-model="form.type" type="text" placeholder="Full-time, Part-time..." required maxlength="50" :class="inputClass" />
          </div>
        </div>

        <AdminTranslatableInput v-model="form.role" label="Role" required :maxlength="150" />

        <AdminToggleSwitch v-model="form.current" label="Posisi saat ini (current)" />

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label :class="labelClass">Mulai</label>
            <input v-model="startMonth" type="month" required :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass">Selesai</label>
            <input v-model="endMonth" type="month" :disabled="form.current" :required="!form.current" :class="[inputClass, form.current && 'opacity-50']" />
          </div>
        </div>

        <div>
          <label :class="labelClass">Location</label>
          <input v-model="form.location" type="text" required maxlength="150" :class="inputClass" />
        </div>

        <AdminTranslatableInput v-model="form.description" label="Description" type="textarea" :rows="5" required :maxlength="2000" />

        <div>
          <label :class="labelClass">Skills</label>
          <AdminTagInput v-model="form.skills" placeholder="Tambah skill..." />
        </div>

        <div v-if="editingId !== null">
          <label :class="labelClass">Project yang dikerjakan di sini</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="p in projectStore.adminProjects"
              :key="p.id"
              type="button"
              :class="[
                'px-3 py-1.5 rounded-full text-sm border transition-colors',
                form.projectIds.includes(p.id)
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-accent-500',
              ]"
              @click="toggleProject(p.id)"
            >
              {{ p.title }}
            </button>
          </div>
        </div>
        <p v-else class="text-xs text-slate-400">Simpan dulu, baru bisa pilih project yang terkait.</p>

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
