import { defineStore } from 'pinia'
import type { LoginResponseDto, LoginChallenge } from '~/types'

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = useCookie<string | null>('admin_token', { default: () => null })

  // Set right after a first-step login (password/Google/Microsoft) when the
  // backend says "not done yet, I need a code" — holds everything the next
  // step (/verify-totp or /verify-email-otp) needs to finish the login.
  const pendingToken = ref<string | null>(null)
  const pendingChallenge = ref<Exclude<LoginChallenge, 'None'> | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const needsVerification = computed(() => !!pendingChallenge.value)

  function applyLoginResponse(response: LoginResponseDto): boolean {
    if (response.challenge === 'None') {
      token.value = response.accessToken
      pendingToken.value = null
      pendingChallenge.value = null
      return true
    }

    pendingToken.value = response.pendingToken
    pendingChallenge.value = response.challenge
    return false
  }

  async function post(path: string, body: Record<string, string>): Promise<boolean> {
    const config = useRuntimeConfig()
    try {
      const response = await $fetch<LoginResponseDto>(`${config.public.apiBase}${path}`, {
        method: 'POST',
        body,
      })
      return applyLoginResponse(response)
    } catch {
      return false
    }
  }

  function login(username: string, password: string) {
    return post('/auth/login', { username, password })
  }

  function loginWithGoogle(idToken: string) {
    return post('/auth/google', { idToken })
  }

  function loginWithMicrosoft(idToken: string) {
    return post('/auth/microsoft', { idToken })
  }

  function verifyCode(code: string) {
    if (!pendingToken.value || !pendingChallenge.value) return Promise.resolve(false)

    const path = pendingChallenge.value === 'Totp'
      ? '/auth/login/verify-totp'
      : '/auth/login/verify-email-otp'

    return post(path, { pendingToken: pendingToken.value, code })
  }

  function logout() {
    token.value = null
    pendingToken.value = null
    pendingChallenge.value = null
  }

  return {
    isAuthenticated,
    needsVerification,
    pendingChallenge,
    login,
    loginWithGoogle,
    loginWithMicrosoft,
    verifyCode,
    logout,
  }
})
