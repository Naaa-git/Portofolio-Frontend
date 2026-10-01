<script setup lang="ts">
import { User, Sparkles, Link2, Briefcase, FolderKanban } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Admin Overview — Pradana Aldi Musthofa' })

const profileStore = useProfileStore()
const projectStore = useProjectStore()
projectStore.loadProjects()

const cards = computed(() => [
  { label: 'Skills', count: profileStore.skills.length, icon: Sparkles, to: '/admin/skills' },
  { label: 'Social Links', count: profileStore.socialLinks.length, icon: Link2, to: '/admin/social-links' },
  { label: 'Experience', count: profileStore.experiences.length, icon: Briefcase, to: '/admin/experience' },
  { label: 'Projects', count: projectStore.projects.length, icon: FolderKanban, to: '/admin/projects' },
])
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Overview</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
      Halo, {{ profileStore.profile.shortName }}. Ini ringkasan konten portfolio kamu saat ini.
    </p>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <NuxtLink
        v-for="card in cards"
        :key="card.label"
        :to="card.to"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-accent-500 transition-colors"
      >
        <component :is="card.icon" :size="18" class="text-accent-500 mb-3" />
        <div class="text-2xl font-bold">{{ card.count }}</div>
        <div class="text-sm text-slate-500 dark:text-slate-400">{{ card.label }}</div>
      </NuxtLink>
    </div>

    <NuxtLink
      to="/admin/profile"
      class="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-accent-500 transition-colors w-fit"
    >
      <User :size="18" class="text-accent-500" />
      <div>
        <div class="text-sm font-medium">Edit Profile</div>
        <div class="text-xs text-slate-500 dark:text-slate-400">Nama, bio, kontak, dan info utama</div>
      </div>
    </NuxtLink>

    <p class="text-xs text-slate-500 dark:text-slate-500 mt-8">
      Catatan: dashboard ini masih mode mock — perubahan tersimpan di memory browser (hilang saat refresh),
      belum persist ke database. Akan tersambung ke backend setelah sinkronisasi API.
    </p>
  </div>
</template>
