// Backend's [ApiController] auto-400 returns ProblemDetails with ModelState
// errors ({field: string[]}) on validation failure. ofetch ($fetch) attaches
// the parsed JSON body to err.data — read that first, fall back to .title,
// then to the caller's own generic message for anything else (network error,
// 500, etc).
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const data = (err as { data?: { errors?: Record<string, string[]>; title?: string } } | undefined)?.data

  if (data?.errors) {
    const messages = Object.values(data.errors).flat()
    if (messages.length) return messages.join(' ')
  }

  if (data?.title) return data.title

  return fallback
}
