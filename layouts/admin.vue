<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

const sidebarOpen = useState('admin-sidebar-open', () => false)
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <AdminSidebar />

    <!-- Backdrop: only rendered while the drawer is open, tap-to-close -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 md:hidden"
      @click="sidebarOpen = false"
    />

    <main class="flex-1 min-w-0">
      <div class="h-14 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 md:hidden">
        <button
          class="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          @click="sidebarOpen = true"
        >
          <Menu :size="20" />
        </button>
      </div>

      <div class="max-w-4xl mx-auto px-6 py-8 md:px-10 md:py-10">
        <slot />
      </div>
    </main>
  </div>
</template>
