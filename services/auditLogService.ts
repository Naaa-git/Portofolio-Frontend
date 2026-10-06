import { apiFetch } from './apiClient'
import type { AuditLog } from '~/types'

export const auditLogService = {
  getRecent: (limit = 200) => apiFetch<AuditLog[]>(`/audit-log?limit=${limit}`),
}
