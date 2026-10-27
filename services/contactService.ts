import { apiFetch } from './apiClient'
import type { ContactSubmitPayload, ContactMessageAdmin } from '~/types'

export const contactService = {
  send: (dto: ContactSubmitPayload) => apiFetch<void>('/contact', { method: 'POST', body: dto }),
  getAllAdmin: () => apiFetch<ContactMessageAdmin[]>('/contact/admin'),
  remove: (id: number) => apiFetch<void>(`/contact/${id}`, { method: 'DELETE' }),
}
