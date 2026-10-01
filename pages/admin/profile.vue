<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Edit Profile — Admin' })

const profileStore = useProfileStore()

const form = reactive({ ...profileStore.profile })
const saved = ref(false)

function handleSubmit() {
  profileStore.updateProfile({ ...form })
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'
const labelClass = 'block text-sm font-medium mb-1.5'
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Profile</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Informasi utama yang tampil di halaman publik.</p>

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

      <div>
        <label :class="labelClass">Role</label>
        <input v-model="form.role" type="text" required :class="inputClass" />
      </div>

      <div>
        <label :class="labelClass">Role alternatif (animasi typing)</label>
        <AdminTagInput v-model="form.roleAlternatives" placeholder="Tambah role..." />
      </div>

      <div>
        <label :class="labelClass">Tagline</label>
        <input v-model="form.tagline" type="text" required :class="inputClass" />
      </div>

      <div>
        <label :class="labelClass">Bio singkat</label>
        <textarea v-model="form.bio" rows="3" required :class="inputClass" />
      </div>

      <div>
        <label :class="labelClass">Bio lanjutan</label>
        <textarea v-model="form.bioExtended" rows="3" required :class="inputClass" />
      </div>

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
        <span v-if="saved" class="text-sm text-emerald-500">Tersimpan!</span>
      </div>
    </form>
  </div>
</template>
