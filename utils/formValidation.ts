// Client-side pre-submit validation. Forms use `novalidate` + these checks
// instead of the browser's native constraint validation (popup tooltips) —
// errors render inline via AdminFieldError, consistent with the rest of the
// app's UI instead of a browser-styled popup that doesn't distinguish
// "wajib diisi" from "format salah".

export function requiredError(value: string, fieldLabel: string): string | undefined {
  return value.trim().length === 0 ? `${fieldLabel} wajib diisi.` : undefined
}

export function urlError(value: string, fieldLabel: string, options: { required?: boolean } = {}): string | undefined {
  const trimmed = value.trim()
  if (trimmed.length === 0) return options.required ? `${fieldLabel} wajib diisi.` : undefined

  try {
    new URL(trimmed)
    return undefined
  } catch {
    return `${fieldLabel} harus berupa URL yang valid.`
  }
}

export function slugError(value: string, fieldLabel: string): string | undefined {
  const required = requiredError(value, fieldLabel)
  if (required) return required
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
    ? undefined
    : `${fieldLabel} cuma boleh huruf kecil, angka, dan tanda "-" di antaranya.`
}

// hasError ? tambahin border merah ke class input yang sudah ada : class aslinya.
export function errorInputClass(baseClass: string, hasError: boolean | string | undefined): (string | false)[] {
  return [baseClass, !!hasError && 'border-red-500 focus:border-red-500']
}
