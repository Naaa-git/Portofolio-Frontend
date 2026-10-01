import { defineStore } from 'pinia'

// Mock auth for now — hardcoded credentials, no backend call yet.
// login()/logout() keep the same shape they'll have once wired to
// POST /api/auth/login, so swapping later only touches this file.
const MOCK_USERNAME = 'admin'
const MOCK_PASSWORD = 'admin123'

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = useCookie<string | null>('admin_token', { default: () => null })

  const isAuthenticated = computed(() => !!token.value)

  function login(username: string, password: string): boolean {
    if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
      token.value = 'mock-token'
      return true
    }
    return false
  }

  function logout() {
    token.value = null
  }

  return { isAuthenticated, login, logout }
})
