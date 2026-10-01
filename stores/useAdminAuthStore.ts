import { defineStore } from 'pinia'

interface LoginResponse {
  accessToken: string
  expiresAtUtc: string
}

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = useCookie<string | null>('admin_token', { default: () => null })

  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string): Promise<boolean> {
    const config = useRuntimeConfig()
    try {
      const response = await $fetch<LoginResponse>(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: { username, password },
      })
      token.value = response.accessToken
      return true
    } catch {
      return false
    }
  }

  function logout() {
    token.value = null
  }

  return { isAuthenticated, login, logout }
})
