type FetchOptions = Parameters<typeof $fetch>[1]

/**
 * Thin wrapper around $fetch that points at the .NET backend and attaches the
 * admin JWT (if present) as a Bearer token. Public GETs work with no token;
 * write endpoints will 401 without one.
 */
export function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('admin_token')
  const { locale } = useI18n()

  const [base, query = ''] = path.split('?')
  const params = new URLSearchParams(query)
  if (!params.has('lang')) params.set('lang', locale.value)
  const url = `${base}?${params.toString()}`

  return $fetch<T>(`${config.public.apiBase}${url}`, {
    ...options,
    headers: {
      ...(options?.headers as Record<string, string> | undefined),
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
  })
}
