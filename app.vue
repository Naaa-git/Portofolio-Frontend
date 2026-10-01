<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { toast } from 'vue-sonner'

const profileStore = useProfileStore()
const adminAuthStore = useAdminAuthStore()
const colorMode = useColorMode()
const router = useRouter()

// Loaded once here (not per-page) because AppFooter needs socialLinks on
// every route, and several pages (home/about/contact) need profile/skills.
await callOnce('profile-data', () => profileStore.loadAll())

// Microsoft login redirects the WHOLE TAB to Microsoft then back to us — it
// can land on whatever page happened to be current when loginRedirect() was
// called, not necessarily /admin/login. Catching it here, globally, means it
// doesn't matter which page the browser ends up back on.
onMounted(async () => {
  const msalInstance = await useMsal()
  const result = await msalInstance.handleRedirectPromise()
  if (!result) return // not returning from a Microsoft redirect

  const success = await adminAuthStore.loginWithMicrosoft(result.idToken)
  if (success) {
    toast.success('Berhasil login.')
    router.push('/admin')
  } else if (adminAuthStore.needsVerification) {
    toast.info('Masukkan kode dari Authenticator app kamu.')
    router.push('/admin/login')
  } else {
    toast.error('Akun Microsoft ini tidak diizinkan login.')
    router.push('/admin/login')
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster rich-colors close-button :theme="colorMode.value === 'dark' ? 'dark' : 'light'" />
</template>
