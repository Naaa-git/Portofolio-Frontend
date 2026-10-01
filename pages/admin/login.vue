<script setup lang="ts">
import { Lock, ShieldCheck } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({ layout: false })

const profileStore = useProfileStore()
const adminAuthStore = useAdminAuthStore()
const config = useRuntimeConfig()
const router = useRouter()

useHead({ title: `Admin Login — ${profileStore.profile.name}` })

const username = ref('')
const password = ref('')
const code = ref('')
const isSubmitting = ref(false)
const googleButtonEl = ref<HTMLElement>()

function goToDashboard() {
  router.push('/admin')
}

async function handlePasswordLogin() {
  isSubmitting.value = true
  const success = await adminAuthStore.login(username.value, password.value)
  isSubmitting.value = false

  if (success) {
    toast.success('Berhasil login.')
    goToDashboard()
  } else if (adminAuthStore.needsVerification) {
    toast.info('Kode verifikasi dikirim — cek email/Authenticator app kamu.')
  } else {
    toast.error('Username atau password salah.')
  }
}

async function handleVerifyCode() {
  isSubmitting.value = true
  const success = await adminAuthStore.verifyCode(code.value)
  isSubmitting.value = false

  if (success) {
    toast.success('Berhasil login.')
    goToDashboard()
  } else {
    toast.error('Kode salah atau sudah kedaluwarsa.')
    code.value = ''
  }
}

async function handleGoogleCredential(response: { credential: string }) {
  const success = await adminAuthStore.loginWithGoogle(response.credential)
  if (success) {
    toast.success('Berhasil login.')
    goToDashboard()
  } else if (adminAuthStore.needsVerification) {
    toast.info('Masukkan kode dari Authenticator app kamu.')
  } else {
    toast.error('Akun Google ini tidak diizinkan login.')
  }
}

async function handleMicrosoftLogin() {
  // Redirect flow: the whole tab navigates to Microsoft, then back to us.
  // More reliable than popup flow, which is flaky on localhost (popup
  // blockers, browsers opening it as a tab instead of a true popup, etc.)
  // The return trip is caught globally in app.vue, not here — Microsoft can
  // redirect back to whatever page was current, not necessarily this one.
  const msalInstance = await useMsal()
  await msalInstance.loginRedirect({ scopes: ['openid', 'email', 'profile'] })
  // Execution stops here — the page is navigating away.
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  await loadScript('https://accounts.google.com/gsi/client')

  // @ts-expect-error - global injected by the Google script, no official types package
  window.google.accounts.id.initialize({
    client_id: config.public.googleClientId,
    callback: handleGoogleCredential,
  })
  // @ts-expect-error - same as above
  window.google.accounts.id.renderButton(googleButtonEl.value, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    width: 300,
  })
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0f1e] px-4">
    <div class="w-full max-w-sm glass rounded-2xl p-8">
      <template v-if="!adminAuthStore.needsVerification">
        <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-500 mb-5">
          <Lock :size="20" />
        </div>
        <h1 class="text-xl font-bold mb-1">Admin Login</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Pilih salah satu cara masuk.</p>

        <div ref="googleButtonEl" class="mb-3" />

        <button
          type="button"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium hover:border-accent-500 hover:text-accent-500 transition-colors mb-6"
          @click="handleMicrosoftLogin"
        >
          Sign in with Microsoft
        </button>

        <div class="flex items-center gap-3 mb-6">
          <div class="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          <span class="text-xs text-slate-400">atau pakai password</span>
          <div class="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        </div>

        <form class="space-y-4" @submit.prevent="handlePasswordLogin">
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

          <AppButton type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? 'Masuk...' : 'Login' }}
          </AppButton>
        </form>
      </template>

      <template v-else>
        <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-500 mb-5">
          <ShieldCheck :size="20" />
        </div>
        <h1 class="text-xl font-bold mb-1">Masukkan Kode</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {{
            adminAuthStore.pendingChallenge === 'Totp'
              ? 'Buka Authenticator app kamu dan masukkan kode 6 digit.'
              : 'Kode sudah dikirim ke email kamu. Cek inbox/spam.'
          }}
        </p>

        <form class="space-y-4" @submit.prevent="handleVerifyCode">
          <input
            v-model="code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            required
            autofocus
            placeholder="123456"
            class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
          />
          <AppButton type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? 'Memverifikasi...' : 'Verifikasi' }}
          </AppButton>
          <button
            type="button"
            class="w-full text-sm text-slate-500 hover:text-accent-500 transition-colors"
            @click="adminAuthStore.logout()"
          >
            Batal, kembali ke login
          </button>
        </form>
      </template>
    </div>
  </div>
</template>
