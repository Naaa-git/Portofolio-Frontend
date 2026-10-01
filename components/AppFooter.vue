<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const iconMap = { github: Github, linkedin: Linkedin, mail: Mail }
const profileStore = useProfileStore()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 dark:border-white/5 py-10">
    <div class="container-max px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-sm text-slate-500 dark:text-slate-500">
        © {{ year }} Pradana Aldi Musthofa. All rights reserved.
      </p>
      <div class="flex items-center gap-3">
        <a
          v-for="link in profileStore.socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          :aria-label="link.name"
        >
          <component :is="iconMap[link.icon as keyof typeof iconMap]" :size="18" />
        </a>
      </div>
    </div>
  </footer>
</template>
