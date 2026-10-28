export default defineNuxtRouteMiddleware(async () => {
  const adminAuthStore = useAdminAuthStore()
  const token = useCookie<string | null>('admin_token')

  if (!token.value) {
    return navigateTo('/admin/login')
  }

  // Proactive check — if the access token already expired, refresh it BEFORE
  // letting the page open, instead of opening the page and only discovering
  // it's dead when the first API call 401s (the original bug).
  if (isJwtExpired(token.value)) {
    const refreshed = await adminAuthStore.refreshAccessToken()
    if (!refreshed) return navigateTo('/admin/login')
  }
})
