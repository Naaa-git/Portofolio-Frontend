// Reads the `exp` claim straight out of the JWT payload, no signature
// check — this is purely a UX shortcut (decide whether to refresh before
// bothering the backend), not a security boundary. The backend is the one
// that actually validates the token on every request.
export function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
    const { exp } = JSON.parse(json) as { exp?: number }
    return typeof exp === 'number' ? exp : null
  } catch {
    return null
  }
}

export function isJwtExpired(token: string): boolean {
  const exp = decodeJwtExp(token)
  if (exp === null) return true
  return Date.now() >= exp * 1000
}
