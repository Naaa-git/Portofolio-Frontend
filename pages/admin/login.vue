<script setup lang="ts">
import { Lock } from 'lucide-vue-next'

definePageMeta({ layout: false })

useHead({ title: 'Admin Login — Pradana Aldi Musthofa' })

const adminAuthStore = useAdminAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

function handleSubmit() {
  error.value = ''
  const success = adminAuthStore.login(username.value, password.value)
  if (success) {
    router.push('/admin')
  } else {
    error.value = 'Username atau password salah.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0f1e] px-4">
    <div class="w-full max-w-sm glass rounded-2xl p-8">
      <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-500 mb-5">
        <Lock :size="20" />
      </div>
      <h1 class="text-xl font-bold mb-1">Admin Login</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Masuk untuk mengelola konten portfolio.</p>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium mb-1.5">Username</label>
          <input
            v-model="username"
            type="text"
            required
            autocomplete="username"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1.5">Password</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
          />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <AppButton type="submit" class="w-full">Login</AppButton>
      </form>

      <p class="text-xs text-slate-500 dark:text-slate-500 mt-6 text-center">
        Mock login — belum tersambung ke backend. Default: <code class="text-accent-500">admin</code> / <code class="text-accent-500">admin123</code>
      </p>
    </div>
  </div>
</template>
