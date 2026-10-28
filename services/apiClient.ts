type FetchOptions = Parameters<typeof $fetch>[1]

/**
 * Thin wrapper around $fetch that points at the .NET backend and attaches the
 * admin JWT (if present) as a Bearer token. Public GETs work with no token;
 * write endpoints will 401 without one.
 *
 * On a 401 (access token expired mid-session), silently exchanges the
 * refresh_token cookie for a new access token and retries once — the caller
 * never sees the 401 unless the refresh itself fails too (session truly
 * over), in which case the user is logged out and sent back to /admin/login.
 */
export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('admin_token')
  // useNuxtApp() (unlike useI18n()) isn't restricted to being called synchronously
  // inside setup() — apiFetch gets called from anywhere, including debounced
  // callbacks (e.g. search-as-you-type), so it can't rely on that restriction.
  const locale = useNuxtApp().$i18n.locale.value

  const [base, query = ''] = path.split('?')
  const params = new URLSearchParams(query)
  if (!params.has('lang')) params.set('lang', locale)
  const url = `${base}?${params.toString()}`

  // SSR runs inside the frontend container — reach the api container
  // directly over Docker's internal network. The browser has no idea what
  // "api" means, so client-side calls need the public-facing address.
  const apiBase = import.meta.server ? config.apiBaseInternal : config.public.apiBase

  const call = (bearerToken: string | null) =>
    $fetch<T>(`${apiBase}${url}`, {
      ...options,
      headers: {
        ...(options?.headers as Record<string, string> | undefined),
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      },
    })

  try {
    return await call(token.value)
  } catch (err) {
    const status = (err as { response?: { status?: number } } | undefined)?.response?.status
    if (status !== 401 || !token.value) throw err

    const adminAuthStore = useAdminAuthStore()
    const refreshed = await adminAuthStore.refreshAccessToken()
    if (!refreshed) {
      await adminAuthStore.logout()
      await navigateTo('/admin/login')
      throw err
    }

    return await call(token.value)
  }
}
