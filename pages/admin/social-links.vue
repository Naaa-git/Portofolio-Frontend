<script setup lang="ts">
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { SocialLink } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Social Links — Admin' })

const profileStore = useProfileStore()

const showModal = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<Omit<SocialLink, 'id'>>({ name: '', url: '', icon: '' })
const deleteTarget = ref<SocialLink | null>(null)

const errors = reactive<Record<string, string | undefined>>({})

function validate(): boolean {
  errors.name = requiredError(form.name, 'Name')
  errors.url = urlError(form.url, 'URL', { required: true })
  errors.icon = requiredError(form.icon, 'Icon')
  return !Object.values(errors).some(Boolean)
}

watch(() => form.name, () => { errors.name = undefined })
watch(() => form.url, () => { errors.url = undefined })
watch(() => form.icon, () => { errors.icon = undefined })

function openCreate() {
  editingId.value = null
  Object.assign(form, { name: '', url: '', icon: '' })
  Object.keys(errors).forEach(k => { errors[k] = undefined })
  showModal.value = true
}

function openEdit(row: SocialLink) {
  editingId.value = row.id
  Object.assign(form, { name: row.name, url: row.url, icon: row.icon })
  Object.keys(errors).forEach(k => { errors[k] = undefined })
  showModal.value = true
}

async function handleSubmit() {
  if (!validate()) return
  try {
    if (editingId.value !== null) {
      await profileStore.updateSocialLink(editingId.value, { ...form })
      toast.success('Social link berhasil diperbarui.')
    } else {
      await profileStore.addSocialLink({ ...form })
      toast.success('Social link berhasil ditambahkan.')
    }
    showModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan. Pastikan kamu masih login dan backend berjalan.'))
  }
}

async function confirmDelete() {
  if (deleteTarget.value) {
    try {
      await profileStore.deleteSocialLink(deleteTarget.value.id)
      toast.success('Social link berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus. Pastikan kamu masih login dan backend berjalan.'))
    }
  }
  deleteTarget.value = null
}

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold mb-1">Social Links</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Link sosial yang tampil di halaman Contact.</p>
      </div>
      <AppButton size="sm" @click="openCreate"><Plus :size="16" /> Tambah</AppButton>
    </div>

    <AdminTable :headers="['Name', 'URL', 'Icon', '']" :is-empty="profileStore.socialLinks.length === 0">
      <tr v-for="row in profileStore.socialLinks" :key="row.id">
        <td class="px-4 py-3 font-medium">{{ row.name }}</td>
        <td class="px-4 py-3 text-slate-500 truncate max-w-xs">{{ row.url }}</td>
        <td class="px-4 py-3"><AppBadge>{{ row.icon }}</AppBadge></td>
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

    <AdminModal :show="showModal" :title="editingId !== null ? 'Edit Social Link' : 'Tambah Social Link'" @close="showModal = false">
      <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
        <div>
          <AdminLabel text="Name" required />
          <input v-model="form.name" type="text" maxlength="50" :class="errorInputClass(inputClass, errors.name)" />
          <AdminFieldError :message="errors.name" />
        </div>
        <div>
          <AdminLabel text="URL" required />
          <input v-model="form.url" type="url" maxlength="500" :class="errorInputClass(inputClass, errors.url)" />
          <AdminFieldError :message="errors.url" />
        </div>
        <div>
          <AdminLabel text="Icon (lucide name)" required />
          <input v-model="form.icon" type="text" placeholder="github, linkedin, mail..." maxlength="50" :class="errorInputClass(inputClass, errors.icon)" />
          <AdminFieldError :message="errors.icon" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <AppButton type="button" variant="ghost" size="sm" @click="showModal = false">Batal</AppButton>
          <AppButton type="submit" size="sm">Simpan</AppButton>
        </div>
      </form>
    </AdminModal>

    <AdminConfirmDialog
      :show="!!deleteTarget"
      :message="`Hapus social link '${deleteTarget?.name}'?`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
