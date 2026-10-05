<script setup lang="ts">
import { Check, X, Eye, EyeOff } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { apiFetch } from '~/services/apiClient'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Security — Admin' })

interface TotpSetupResponse {
  secret: string
  qrCodeImageBase64: string
}

const qrImage = ref<string | null>(null)
const secret = ref<string | null>(null)
const code = ref('')
const isLoadingQr = ref(false)
const isEnabling = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const isChangingPassword = ref(false)
const isNewPasswordVisible = ref(false)

// Kept in sync with AuthService.IsPasswordStrongEnough on the backend —
// if the rule changes there, it needs to change here too.
const passwordRules = computed(() => [
  { label: 'Minimal 8 karakter', met: newPassword.value.length >= 8 },
  { label: 'Ada huruf besar (A-Z)', met: /[A-Z]/.test(newPassword.value) },
  { label: 'Ada angka (0-9)', met: /[0-9]/.test(newPassword.value) },
])

const isNewPasswordValid = computed(() => passwordRules.value.every(rule => rule.met))

async function startSetup() {
  isLoadingQr.value = true
  try {
    const result = await apiFetch<TotpSetupResponse>('/auth/totp/setup', { method: 'POST' })
    qrImage.value = `data:image/png;base64,${result.qrCodeImageBase64}`
    secret.value = result.secret
  } catch {
    toast.error('Gagal memulai setup. Pastikan kamu masih login.')
  } finally {
    isLoadingQr.value = false
  }
}

async function confirmEnable() {
  isEnabling.value = true
  try {
    await apiFetch('/auth/totp/enable', { method: 'POST', body: { code: code.value } })
    toast.success('2FA (TOTP) berhasil diaktifkan.')
    qrImage.value = null
    secret.value = null
    code.value = ''
  } catch {
    toast.error('Kode salah. Coba scan ulang QR dan masukkan kode terbaru.')
  } finally {
    isEnabling.value = false
  }
}

async function changePassword() {
  isChangingPassword.value = true
  try {
    await apiFetch('/auth/password', {
      method: 'PUT',
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    })
    toast.success('Password berhasil diganti.')
    currentPassword.value = ''
    newPassword.value = ''
  } catch (err: any) {
    toast.error(err?.data?.message ?? 'Gagal mengganti password.')
  } finally {
    isChangingPassword.value = false
  }
}

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'
</script>

<template>
  <div class="max-w-lg">
    <h1 class="text-2xl font-bold mb-1">Security</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
      Setup Two-Factor Authentication (TOTP) buat login via Google/Microsoft.
    </p>

    <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div v-if="!qrImage">
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Klik tombol di bawah buat generate QR code baru. Setelah di-scan, kamu perlu konfirmasi
          dengan 1 kode dari Authenticator app sebelum 2FA aktif.
        </p>
        <AppButton :disabled="isLoadingQr" @click="startSetup">
          {{ isLoadingQr ? 'Memuat...' : 'Generate QR Code' }}
        </AppButton>
      </div>

      <div v-else class="space-y-5">
        <div class="flex justify-center">
          <img :src="qrImage" alt="QR code 2FA" class="w-56 h-56 rounded-lg border border-slate-200 dark:border-slate-700" />
        </div>

        <div>
          <p class="text-xs text-slate-500 mb-1">Atau masukkan manual di Authenticator app:</p>
          <code class="text-xs break-all bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{{ secret }}</code>
        </div>

        <form class="space-y-3" @submit.prevent="confirmEnable">
          <label class="block text-sm font-medium">Masukkan kode dari Authenticator app</label>
          <input
            v-model="code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            required
            placeholder="123456"
            :class="inputClass"
          />
          <AppButton type="submit" :disabled="isEnabling">
            {{ isEnabling ? 'Memverifikasi...' : 'Aktifkan 2FA' }}
          </AppButton>
        </form>
      </div>
    </div>

    <h2 class="text-lg font-semibold mt-10 mb-4">Ganti Password</h2>
    <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <form class="space-y-4" @submit.prevent="changePassword">
        <div>
          <label class="block text-sm font-medium mb-1.5">Password saat ini</label>
          <input v-model="currentPassword" type="password" required autocomplete="current-password" :class="inputClass" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Password baru</label>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="isNewPasswordVisible ? 'text' : 'password'"
              required
              autocomplete="new-password"
              :class="inputClass"
              class="pr-10"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              :aria-label="isNewPasswordVisible ? 'Sembunyikan password' : 'Tampilkan password'"
              @click="isNewPasswordVisible = !isNewPasswordVisible"
            >
              <EyeOff v-if="isNewPasswordVisible" :size="16" />
              <Eye v-else :size="16" />
            </button>
          </div>

          <ul class="mt-2 space-y-1">
            <li
              v-for="rule in passwordRules"
              :key="rule.label"
              class="flex items-center gap-1.5 text-xs transition-colors"
              :class="rule.met ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'"
            >
              <Check v-if="rule.met" :size="14" />
              <X v-else :size="14" />
              {{ rule.label }}
            </li>
          </ul>
        </div>
        <AppButton type="submit" :disabled="isChangingPassword || !isNewPasswordValid">
          {{ isChangingPassword ? 'Menyimpan...' : 'Ganti Password' }}
        </AppButton>
      </form>
    </div>
  </div>
</template>
