<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const profileStore = useProfileStore()
const colorMode = useColorMode()

// Loaded once here (not per-page) because AppFooter needs socialLinks on
// every route, and several pages (home/about/contact) need profile/skills.
await callOnce('profile-data', () => profileStore.loadAll())
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster rich-colors close-button :theme="colorMode.value === 'dark' ? 'dark' : 'light'" />
</template>
