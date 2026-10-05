<script setup lang="ts">
import { Sun, Moon, Menu, X, Languages } from 'lucide-vue-next'

const colorMode = useColorMode()
const route = useRoute()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { t, locale } = useI18n()
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const navLinks = computed(() => [
  { label: t('nav.home'), href: localePath('/') },
  { label: t('nav.projects'), href: localePath('/projects') },
  { label: t('nav.about'), href: localePath('/about') },
  { label: t('nav.contact'), href: localePath('/contact') },
])

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Hard navigation (not SPA) so every store refetches with the new ?lang= —
// content comes from the backend keyed by locale, and the stores/callOnce
// guards only fetch once per full page load.
function switchLocale() {
  const target = locale.value === 'id' ? 'en' : 'id'

  let path = ''
  try {
    path = switchLocalePath(target) || ''
  } catch {
    path = ''
  }

  // Fallback if the composable can't resolve it (e.g. edge cases with route
  // matching): just toggle the /en prefix on the current path manually.
  if (!path) {
    const current = route.path
    path = target === 'id'
      ? current.replace(/^\/en(?=\/|$)/, '') || '/'
      : `/en${current}`
  }

  window.location.href = path
}

function closeMenu() {
  isMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})

watch(() => route.path, closeMenu)
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'glass border-b border-white/10 dark:border-white/5' : 'bg-transparent',
    ]"
  >
    <div class="container-max px-6">
      <nav class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="text-lg font-semibold tracking-tight hover:text-accent-500 transition-colors">
          pradana<span class="text-accent-500">.</span>dev
        </NuxtLink>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            :to="link.href"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              route.path === link.href
                ? 'text-accent-500 bg-accent-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5',
            ]"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-2">
          <!-- Language switch -->
          <button
            class="flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            @click="switchLocale"
          >
            <Languages :size="16" /> {{ locale.toUpperCase() }}
          </button>

          <!-- Theme toggle -->
          <button
            class="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            @click="toggleColorMode"
          >
            <Sun v-if="colorMode.value === 'dark'" :size="18" />
            <Moon v-else :size="18" />
          </button>

          <!-- Mobile menu toggle -->
          <button
            class="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            @click="isMenuOpen = !isMenuOpen"
          >
            <X v-if="isMenuOpen" :size="20" />
            <Menu v-else :size="20" />
          </button>
        </div>
      </nav>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="isMenuOpen" class="md:hidden glass border-t border-white/10 dark:border-white/5">
        <div class="px-6 py-4 flex flex-col gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            :to="link.href"
            :class="[
              'px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              route.path === link.href
                ? 'text-accent-500 bg-accent-500/10'
                : 'text-slate-600 dark:text-slate-400',
            ]"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
