<script setup lang="ts">
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import type { Skill } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Skills — Admin' })

const profileStore = useProfileStore()

type SkillRow = Skill & { id: number }

const showModal = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<Skill>({ category: '', items: [], sortOrder: 0 })

const deleteTarget = ref<SkillRow | null>(null)

function openCreate() {
  editingId.value = null
  Object.assign(form, { category: '', items: [], sortOrder: profileStore.skills.length + 1 })
  showModal.value = true
}

function openEdit(row: SkillRow) {
  editingId.value = row.id
  Object.assign(form, { category: row.category, items: [...row.items], sortOrder: row.sortOrder })
  showModal.value = true
}

function handleSubmit() {
  if (editingId.value !== null) {
    profileStore.updateSkill(editingId.value, { ...form })
  } else {
    profileStore.addSkill({ ...form })
  }
  showModal.value = false
}

function confirmDelete() {
  if (deleteTarget.value) profileStore.deleteSkill(deleteTarget.value.id)
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

    <AdminTable :headers="['Category', 'Items', 'Order', '']" :is-empty="profileStore.skills.length === 0">
      <tr v-for="row in profileStore.skills" :key="row.id">
        <td class="px-4 py-3 font-medium">{{ row.category }}</td>
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
        <div>
          <label :class="labelClass">Category</label>
          <input v-model="form.category" type="text" required :class="inputClass" />
        </div>
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
      :message="`Hapus skill '${deleteTarget?.category}'?`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
