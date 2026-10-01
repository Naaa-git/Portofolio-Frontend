<script setup lang="ts">
import { LayoutDashboard, User, Sparkles, Link2, Briefcase, FolderKanban, ShieldCheck, LogOut, ExternalLink } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const adminAuthStore = useAdminAuthStore()

const navLinks = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard },
  { label: 'Profile', to: '/admin/profile', icon: User },
  { label: 'Skills', to: '/admin/skills', icon: Sparkles },
  { label: 'Social Links', to: '/admin/social-links', icon: Link2 },
  { label: 'Experience', to: '/admin/experience', icon: Briefcase },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Security', to: '/admin/security', icon: ShieldCheck },
]

function handleLogout() {
  adminAuthStore.logout()
  toast.success('Berhasil logout.')
  router.push('/admin/login')
}
</script>

<template>
  <aside class="w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
    <div class="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
      <span class="text-lg font-semibold tracking-tight">
        pradana<span class="text-accent-500">.</span>admin
      </span>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        :class="[
          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          route.path === link.to
            ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
        ]"
      >
        <component :is="link.icon" :size="16" />
        {{ link.label }}
      </NuxtLink>
    </nav>

    <div class="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
      <NuxtLink
        to="/"
        target="_blank"
        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <ExternalLink :size="16" /> Lihat situs publik
      </NuxtLink>
      <button
        class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        @click="handleLogout"
      >
        <LogOut :size="16" /> Logout
      </button>
    </div>
  </aside>
</template>
