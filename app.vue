<script setup lang="ts">
const profileStore = useProfileStore()
</script>

<template>
  <div>
    <AppNavbar />
    <main class="min-h-screen pt-16">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
