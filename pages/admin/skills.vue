<script setup lang="ts">
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-vue-next'
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

const errors = reactive<Record<string, string | undefined>>({})

function validate(): boolean {
  errors.categoryId = requiredError(form.category.id, 'Category (Indonesia)')
  errors.categoryEn = requiredError(form.category.en, 'Category (English)')
  return !Object.values(errors).some(Boolean)
}

watch(() => form.category.id, () => { errors.categoryId = undefined })
watch(() => form.category.en, () => { errors.categoryEn = undefined })

const skillsTable = useTemplateRef('skillsTable')
useReorderPersist(skillsTable, toRef(profileStore, 'adminSkills'), (item, sortOrder) =>
  profileStore.updateSkill(item.id, { category: item.category, items: item.items, sortOrder }),
)

function openCreate() {
  editingId.value = null
  Object.assign(form, { category: { id: '', en: '' }, items: [], sortOrder: profileStore.adminSkills.length + 1 })
  Object.keys(errors).forEach(k => { errors[k] = undefined })
  showModal.value = true
}

function openEdit(row: SkillAdmin) {
  editingId.value = row.id
  Object.assign(form, { category: { ...row.category }, items: [...row.items], sortOrder: row.sortOrder })
  Object.keys(errors).forEach(k => { errors[k] = undefined })
  showModal.value = true
}

async function handleSubmit() {
  if (!validate()) return
  try {
    if (editingId.value !== null) {
      await profileStore.updateSkill(editingId.value, { ...form })
      toast.success('Skill berhasil diperbarui.')
    } else {
      await profileStore.addSkill({ ...form })
      toast.success('Skill berhasil ditambahkan.')
    }
    showModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan. Pastikan kamu masih login dan backend berjalan.'))
  }
}

async function confirmDelete() {
  if (deleteTarget.value) {
    try {
      await profileStore.deleteSkill(deleteTarget.value.id)
      toast.success('Skill berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus. Pastikan kamu masih login dan backend berjalan.'))
    }
  }
  deleteTarget.value = null
}

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

    <AdminTable ref="skillsTable" :headers="['', 'Category (ID / EN)', 'Items', 'Order', '']" :is-empty="profileStore.adminSkills.length === 0">
      <tr v-for="row in profileStore.adminSkills" :key="row.id">
        <td class="px-4 py-3"><GripVertical :size="16" class="drag-handle cursor-grab text-slate-400" /></td>
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
      <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
        <AdminTranslatableInput v-model="form.category" label="Category" required :maxlength="100" :error-id="errors.categoryId" :error-en="errors.categoryEn" />
        <div>
          <AdminLabel text="Items" />
          <AdminTagInput v-model="form.items" placeholder="Tambah item..." />
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
