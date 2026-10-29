<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Edit Profile — Admin' })

const profileStore = useProfileStore()
await callOnce('profile-admin-data', () => profileStore.loadAdmin())

const form = reactive({ ...profileStore.adminProfile })

const errors = reactive<Record<string, string | undefined>>({})

function validate(): boolean {
  errors.name = requiredError(form.name, 'Nama lengkap')
  errors.shortName = requiredError(form.shortName, 'Nama pendek')
  errors.roleId = requiredError(form.role.id, 'Role (Indonesia)')
  errors.roleEn = requiredError(form.role.en, 'Role (English)')
  errors.taglineId = requiredError(form.tagline.id, 'Tagline (Indonesia)')
  errors.taglineEn = requiredError(form.tagline.en, 'Tagline (English)')
  errors.bioId = requiredError(form.bio.id, 'Bio singkat (Indonesia)')
  errors.bioEn = requiredError(form.bio.en, 'Bio singkat (English)')
  errors.bioExtendedId = requiredError(form.bioExtended.id, 'Bio lanjutan (Indonesia)')
  errors.bioExtendedEn = requiredError(form.bioExtended.en, 'Bio lanjutan (English)')
  errors.email = requiredError(form.email, 'Email')
  errors.location = requiredError(form.location, 'Lokasi')
  errors.avatarUrl = urlError(form.avatarUrl, 'Avatar', { required: true })
  errors.cvUrl = urlError(form.cvUrl, 'CV', { required: true })
  return !Object.values(errors).some(Boolean)
}

watch(() => form.name, () => { errors.name = undefined })
watch(() => form.shortName, () => { errors.shortName = undefined })
watch(() => form.role.id, () => { errors.roleId = undefined })
watch(() => form.role.en, () => { errors.roleEn = undefined })
watch(() => form.tagline.id, () => { errors.taglineId = undefined })
watch(() => form.tagline.en, () => { errors.taglineEn = undefined })
watch(() => form.bio.id, () => { errors.bioId = undefined })
watch(() => form.bio.en, () => { errors.bioEn = undefined })
watch(() => form.bioExtended.id, () => { errors.bioExtendedId = undefined })
watch(() => form.bioExtended.en, () => { errors.bioExtendedEn = undefined })
watch(() => form.email, () => { errors.email = undefined })
watch(() => form.location, () => { errors.location = undefined })
watch(() => form.avatarUrl, () => { errors.avatarUrl = undefined })
watch(() => form.cvUrl, () => { errors.cvUrl = undefined })

async function handleSubmit() {
  if (!validate()) return
  try {
    await profileStore.updateProfile({ ...form })
    toast.success('Profile berhasil disimpan.')
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan. Pastikan kamu masih login dan backend berjalan.'))
  }
}

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Profile</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Informasi utama yang tampil di halaman publik. Field dengan dua kolom bisa diisi dalam Bahasa Indonesia dan English.</p>

    <form class="space-y-5 max-w-2xl" novalidate @submit.prevent="handleSubmit">
      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <AdminLabel text="Nama lengkap" required />
          <input v-model="form.name" type="text" maxlength="100" :class="errorInputClass(inputClass, errors.name)" />
          <AdminFieldError :message="errors.name" />
        </div>
        <div>
          <AdminLabel text="Nama pendek" required />
          <input v-model="form.shortName" type="text" maxlength="50" :class="errorInputClass(inputClass, errors.shortName)" />
          <AdminFieldError :message="errors.shortName" />
        </div>
      </div>

      <AdminTranslatableInput v-model="form.role" label="Role" required :maxlength="100" :error-id="errors.roleId" :error-en="errors.roleEn" />

      <div>
        <AdminLabel text="Role alternatif (animasi typing)" />
        <AdminTranslatableListInput v-model="form.roleAlternatives" :maxlength="100" />
      </div>

      <AdminTranslatableInput v-model="form.tagline" label="Tagline" required :maxlength="200" :error-id="errors.taglineId" :error-en="errors.taglineEn" />
      <AdminTranslatableInput
        v-model="form.bio" label="Bio singkat" type="textarea" :rows="3" required :maxlength="1000"
        :error-id="errors.bioId" :error-en="errors.bioEn"
      />
      <AdminTranslatableInput
        v-model="form.bioExtended" label="Bio lanjutan" type="textarea" :rows="3" required :maxlength="3000"
        :error-id="errors.bioExtendedId" :error-en="errors.bioExtendedEn"
      />

      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <AdminLabel text="Email" required />
          <input v-model="form.email" type="email" maxlength="254" :class="errorInputClass(inputClass, errors.email)" />
          <AdminFieldError :message="errors.email" />
        </div>
        <div>
          <AdminLabel text="Lokasi" required />
          <input v-model="form.location" type="text" maxlength="150" :class="errorInputClass(inputClass, errors.location)" />
          <AdminFieldError :message="errors.location" />
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <AdminLabel text="Avatar" required />
          <AdminFileUploadField v-model="form.avatarUrl" accept="image/*" endpoint="/images/upload" kind="image" />
          <AdminFieldError :message="errors.avatarUrl" />
        </div>
        <div>
          <AdminLabel text="CV (PDF)" required />
          <AdminFileUploadField v-model="form.cvUrl" accept="application/pdf" endpoint="/documents/upload" kind="document" />
          <AdminFieldError :message="errors.cvUrl" />
        </div>
      </div>

      <AdminToggleSwitch v-model="form.availableForWork" label="Available for work" />

      <div class="flex items-center gap-3 pt-2">
        <AppButton type="submit">Simpan Perubahan</AppButton>
      </div>
    </form>
  </div>
</template>
