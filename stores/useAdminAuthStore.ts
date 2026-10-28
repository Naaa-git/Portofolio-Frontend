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
    const apiBase = import.meta.server ? config.apiBaseInternal : config.public.apiBase
    try {
      const response = await $fetch<LoginResponseDto>(`${apiBase}${path}`, {
        method: 'POST',
        body,
        // Needed so the browser stores/sends the HttpOnly refresh_token cookie
        // the backend sets alongside this response — api and frontend are
        // different origins, so this isn't implicit like it would be same-site.
        credentials: 'include',
      })
      return applyLoginResponse(response)
    } catch {
      return false
    }
  }

  // Called by apiFetch's 401 handler, and proactively by the admin-auth
  // middleware — which also runs during SSR (a fresh tab loading /admin
  // directly, not just client-side navigation). A plain $fetch on the server
  // is a separate server-to-server call that does NOT carry the browser's
  // incoming cookies — useRequestFetch() is Nuxt's composable specifically
  // for forwarding the original request's cookies/headers in that case; on
  // the client it behaves like ordinary $fetch.
  async function refreshAccessToken(): Promise<boolean> {
    const config = useRuntimeConfig()
    const apiBase = import.meta.server ? config.apiBaseInternal : config.public.apiBase
    const requestFetch = useRequestFetch()
    try {
      const response = await requestFetch<{ accessToken: string }>(`${apiBase}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      token.value = response.accessToken
      return true
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

  async function logout() {
    const config = useRuntimeConfig()
    const apiBase = import.meta.server ? config.apiBaseInternal : config.public.apiBase
    // Best-effort — revoking the refresh token server-side matters, but
    // clearing local state must happen regardless of whether this succeeds
    // (e.g. the network is down, or the token was already revoked).
    await $fetch(`${apiBase}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})

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
    refreshAccessToken,
    logout,
  }
})
