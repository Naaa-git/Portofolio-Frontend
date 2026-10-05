<script setup lang="ts">
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { SkillAdmin } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Skills — Admin' })

const profileStore = useProfileStore()
await callOnce('profile-admin-data', () => profileStore.loadAdmin())

const showModal = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<Omit<SkillAdmin, 'id'>>({ category: { id: '', en: '' }, items: [], sortOrder: 0 })

const deleteTarget = ref<SkillAdmin | null>(null)

function openCreate() {
  editingId.value = null
  Object.assign(form, { category: { id: '', en: '' }, items: [], sortOrder: profileStore.adminSkills.length + 1 })
  showModal.value = true
}

function openEdit(row: SkillAdmin) {
  editingId.value = row.id
  Object.assign(form, { category: { ...row.category }, items: [...row.items], sortOrder: row.sortOrder })
  showModal.value = true
}

async function handleSubmit() {
  try {
    if (editingId.value !== null) {
      await profileStore.updateSkill(editingId.value, { ...form })
      toast.success('Skill berhasil diperbarui.')
    } else {
      await profileStore.addSkill({ ...form })
      toast.success('Skill berhasil ditambahkan.')
    }
    showModal.value = false
  } catch {
    toast.error('Gagal menyimpan. Pastikan kamu masih login dan backend berjalan.')
  }
}

async function confirmDelete() {
  if (deleteTarget.value) {
    try {
      await profileStore.deleteSkill(deleteTarget.value.id)
      toast.success('Skill berhasil dihapus.')
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
        <h1 class="text-2xl font-bold mb-1">Skills</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Kelompok skill yang tampil di halaman About.</p>
      </div>
      <AppButton size="sm" @click="openCreate"><Plus :size="16" /> Tambah</AppButton>
    </div>

    <AdminTable :headers="['Category (ID / EN)', 'Items', 'Order', '']" :is-empty="profileStore.adminSkills.length === 0">
      <tr v-for="row in profileStore.adminSkills" :key="row.id">
        <td class="px-4 py-3 font-medium">{{ row.category.id }} <span class="text-slate-400">/ {{ row.category.en }}</span></td>
        <td class="px-4 py-3">
          <div class="flex flex-wrap gap-1">
            <AppBadge v-for="item in row.items" :key="item">{{ item }}</AppBadge>
          </div>
        </td>
        <td class="px-4 py-3 text-slate-500">{{ row.sortOrder }}</td>
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

    <AdminModal :show="showModal" :title="editingId !== null ? 'Edit Skill' : 'Tambah Skill'" @close="showModal = false">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AdminTranslatableInput v-model="form.category" label="Category" required />
        <div>
          <label :class="labelClass">Items</label>
          <AdminTagInput v-model="form.items" placeholder="Tambah item..." />
        </div>
        <div>
          <label :class="labelClass">Sort Order</label>
          <input v-model.number="form.sortOrder" type="number" :class="inputClass" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <AppButton type="button" variant="ghost" size="sm" @click="showModal = false">Batal</AppButton>
          <AppButton type="submit" size="sm">Simpan</AppButton>
        </div>
      </form>
    </AdminModal>

    <AdminConfirmDialog
      :show="!!deleteTarget"
      :message="`Hapus skill '${deleteTarget?.category.id}'?`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
