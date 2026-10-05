<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Edit Profile — Admin' })

const profileStore = useProfileStore()
await callOnce('profile-admin-data', () => profileStore.loadAdmin())

const form = reactive({ ...profileStore.adminProfile })

async function handleSubmit() {
  try {
    await profileStore.updateProfile({ ...form })
    toast.success('Profile berhasil disimpan.')
  } catch {
    toast.error('Gagal menyimpan. Pastikan kamu masih login dan backend berjalan.')
  }
}

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'
const labelClass = 'block text-sm font-medium mb-1.5'
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Profile</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Informasi utama yang tampil di halaman publik. Field dengan dua kolom bisa diisi dalam Bahasa Indonesia dan English.</p>

    <form class="space-y-5 max-w-2xl" @submit.prevent="handleSubmit">
      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <label :class="labelClass">Nama lengkap</label>
          <input v-model="form.name" type="text" required :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">Nama pendek</label>
          <input v-model="form.shortName" type="text" required :class="inputClass" />
        </div>
      </div>

      <AdminTranslatableInput v-model="form.role" label="Role" required />

      <div>
        <label :class="labelClass">Role alternatif (animasi typing)</label>
        <AdminTranslatableListInput v-model="form.roleAlternatives" />
      </div>

      <AdminTranslatableInput v-model="form.tagline" label="Tagline" required />
      <AdminTranslatableInput v-model="form.bio" label="Bio singkat" type="textarea" :rows="3" required />
      <AdminTranslatableInput v-model="form.bioExtended" label="Bio lanjutan" type="textarea" :rows="3" required />

      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <label :class="labelClass">Email</label>
          <input v-model="form.email" type="email" required :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">Lokasi</label>
          <input v-model="form.location" type="text" required :class="inputClass" />
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <label :class="labelClass">Avatar URL</label>
          <input v-model="form.avatarUrl" type="text" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">CV URL</label>
          <input v-model="form.cvUrl" type="text" :class="inputClass" />
        </div>
      </div>

      <AdminToggleSwitch v-model="form.availableForWork" label="Available for work" />

      <div class="flex items-center gap-3 pt-2">
        <AppButton type="submit">Simpan Perubahan</AppButton>
      </div>
    </form>
  </div>
</template>
