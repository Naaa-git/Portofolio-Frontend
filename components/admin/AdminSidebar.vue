<script setup lang="ts">
import { LayoutDashboard, User, Sparkles, Link2, Briefcase, FolderKanban, Lightbulb, Coffee, ShieldCheck, ScrollText, LogOut, ExternalLink, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const adminAuthStore = useAdminAuthStore()
const sidebarOpen = useState('admin-sidebar-open', () => false)

const navLinks = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard },
  { label: 'Profile', to: '/admin/profile', icon: User },
  { label: 'Skills', to: '/admin/skills', icon: Sparkles },
  { label: 'Social Links', to: '/admin/social-links', icon: Link2 },
  { label: 'Experience', to: '/admin/experience', icon: Briefcase },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Lessons', to: '/admin/lessons', icon: Lightbulb },
  { label: 'Outside Code', to: '/admin/outside-code', icon: Coffee },
  { label: 'Security', to: '/admin/security', icon: ShieldCheck },
  { label: 'Audit Log', to: '/admin/audit-log', icon: ScrollText },
]

function handleLogout() {
  adminAuthStore.logout()
  toast.success('Berhasil logout.')
  router.push('/admin/login')
}

// On mobile the sidebar is a drawer — any nav click should close it.
// On desktop this is a no-op since the backdrop/drawer classes don't apply.
function closeOnMobile() {
  sidebarOpen.value = false
}
</script>

<template>
  <aside
    :class="[
      'w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col',
      'fixed inset-y-0 left-0 z-40 transition-transform duration-200 md:static md:translate-x-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
      <span class="text-lg font-semibold tracking-tight">
        pradana<span class="text-accent-500">.</span>admin
      </span>
      <button
        class="md:hidden p-1 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        @click="sidebarOpen = false"
      >
        <X :size="18" />
      </button>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
        @click="closeOnMobile"
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
