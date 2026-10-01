export default defineNuxtRouteMiddleware(() => {
  const adminAuthStore = useAdminAuthStore()

  if (!adminAuthStore.isAuthenticated) {
    return navigateTo('/admin/login')
  }
})
