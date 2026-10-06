<script setup lang="ts">
import { auditLogService } from '~/services/auditLogService'
import type { AuditLog } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Audit Log — Admin' })

const logs = ref<AuditLog[]>([])
const isLoading = ref(true)

await callOnce('audit-log-data', async () => {
  try {
    logs.value = await auditLogService.getRecent()
  } finally {
    isLoading.value = false
  }
})

const actionVariant = {
  Create: 'success',
  Update: 'accent',
  Delete: 'default',
} as const

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })
}

function parsedChanges(changes: string | null): { field: string; old: unknown; new: unknown }[] {
  if (!changes) return []
  try {
    const parsed = JSON.parse(changes) as Record<string, { old: unknown; new: unknown }>
    return Object.entries(parsed).map(([field, v]) => ({ field, old: v.old, new: v.new }))
  } catch {
    return []
  }
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Audit Log</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
      Riwayat create/update/delete yang dilakukan lewat admin panel ini — otomatis tercatat, nggak bisa dimatikan dari sini.
    </p>

    <div class="space-y-3">
      <div
        v-for="log in logs"
        :key="log.id"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
      >
        <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div class="flex items-center gap-2">
            <AppBadge :variant="actionVariant[log.action]">{{ log.action }}</AppBadge>
            <span class="text-sm font-medium">{{ log.entityName }}</span>
            <span class="text-xs text-slate-400">#{{ log.entityId }}</span>
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-500">
            {{ log.adminUsername ?? 'system' }} · {{ formatTimestamp(log.timestampUtc) }}
          </div>
        </div>

        <div v-if="parsedChanges(log.changes).length" class="mt-2 space-y-1">
          <div
            v-for="change in parsedChanges(log.changes)"
            :key="change.field"
            class="text-xs font-mono flex flex-wrap items-center gap-1.5"
          >
            <span class="text-slate-500 dark:text-slate-400 font-semibold">{{ change.field }}:</span>
            <span class="text-red-500 dark:text-red-400 line-through">{{ formatValue(change.old) }}</span>
            <span class="text-slate-400">→</span>
            <span class="text-emerald-600 dark:text-emerald-400">{{ formatValue(change.new) }}</span>
          </div>
        </div>
      </div>

      <div v-if="!isLoading && logs.length === 0" class="text-center py-16 text-sm text-slate-500 dark:text-slate-500">
        Belum ada aktivitas tercatat.
      </div>
    </div>
  </div>
</template>
