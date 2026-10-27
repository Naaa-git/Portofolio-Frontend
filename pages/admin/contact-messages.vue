<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { ContactMessageAdmin } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Contact Messages — Admin' })

const contactStore = useContactMessageStore()
const isLoading = ref(true)

await callOnce('contact-messages-admin', async () => {
  try {
    await contactStore.loadAllAdmin()
  } finally {
    isLoading.value = false
  }
})

const statusVariant = {
  Sent: 'success',
  Pending: 'muted',
  Failed: 'default',
} as const

const deleteTarget = ref<ContactMessageAdmin | null>(null)

async function confirmDelete() {
  if (deleteTarget.value) {
    try {
      await contactStore.deleteMessage(deleteTarget.value.id)
      toast.success('Pesan dihapus.')
    } catch {
      toast.error('Gagal menghapus pesan.')
    }
  }
  deleteTarget.value = null
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Contact Messages</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
      Pesan yang masuk lewat form contact di halaman publik. Status mengikuti pengiriman email
      notifikasi — pesan tetap tersimpan di sini meskipun emailnya gagal terkirim.
    </p>

    <div class="space-y-3">
      <div
        v-for="message in contactStore.adminMessages"
        :key="message.id"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
      >
        <div class="flex items-start justify-between gap-3 mb-2 flex-wrap">
          <div>
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-sm font-medium">{{ message.name }}</span>
              <AppBadge :variant="statusVariant[message.status]">{{ message.status }}</AppBadge>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-500">{{ message.email }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-500 dark:text-slate-500">
              {{ formatTimestamp(message.createdAtUtc) }}
            </span>
            <button
              class="text-xs text-red-500 hover:text-red-600 font-medium"
              @click="deleteTarget = message"
            >
              Hapus
            </button>
          </div>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{{ message.message }}</p>

        <p v-if="message.status === 'Failed' && message.errorMessage" class="mt-2 text-xs text-red-500">
          Error: {{ message.errorMessage }}
        </p>
      </div>

      <div v-if="!isLoading && contactStore.adminMessages.length === 0" class="text-center py-16 text-sm text-slate-500 dark:text-slate-500">
        Belum ada pesan masuk.
      </div>
    </div>

    <AdminConfirmDialog
      :show="!!deleteTarget"
      title="Hapus pesan?"
      :message="`Pesan dari ${deleteTarget?.name} akan dihapus permanen.`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
