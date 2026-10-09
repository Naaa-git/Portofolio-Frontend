type FetchOptions = Parameters<typeof $fetch>[1]

/**
 * Thin wrapper around $fetch that points at the .NET backend and attaches the
 * admin JWT (if present) as a Bearer token. Public GETs work with no token;
 * write endpoints will 401 without one.
 */
export function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
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

  return $fetch<T>(`${apiBase}${url}`, {
    ...options,
    headers: {
      ...(options?.headers as Record<string, string> | undefined),
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
  })
}
