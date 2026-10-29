<script setup lang="ts">
import { Upload, Image as ImageIcon, FileText, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { apiFetch } from '~/services/apiClient'

const props = defineProps<{
  modelValue: string
  accept: string
  endpoint: string
  kind: 'image' | 'document'
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)

// Mirrors LocalDiskFileStorageService's allow-lists/limits (portofolio-bc) so
// obviously-wrong files get rejected instantly, before a round trip — the
// backend stays the source of truth and re-checks the same thing server-side.
const LIMITS = {
  image: { extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'], maxBytes: 5 * 1024 * 1024, maxLabel: '5MB' },
  document: { extensions: ['.pdf'], maxBytes: 10 * 1024 * 1024, maxLabel: '10MB' },
} as const

function validateFile(file: File): string | undefined {
  const { extensions, maxBytes, maxLabel } = LIMITS[props.kind]
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`

  if (!extensions.includes(extension as never))
    return `Tipe file '${extension}' tidak didukung. Pakai ${extensions.join(', ')}.`

  if (file.size > maxBytes)
    return `File terlalu besar (maks ${maxLabel}).`

  return undefined
}

async function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const validationError = validateFile(file)
  if (validationError) {
    toast.error(validationError)
    if (fileInput.value) fileInput.value.value = ''
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const result = await apiFetch<{ url: string }>(props.endpoint, { method: 'POST', body: formData })
    emit('update:modelValue', result.url)
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Upload gagal. Cek ukuran/tipe file dan coba lagi.'))
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const fileName = computed(() => props.modelValue.split('/').pop())
</script>

<template>
  <div class="space-y-2">
    <div
      v-if="kind === 'image'"
      class="w-full aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700"
    >
      <img v-if="modelValue" :src="modelValue" class="w-full h-full object-cover" />
      <ImageIcon v-else :size="28" class="text-slate-400" />
    </div>

    <div
      v-else
      class="w-full rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 flex items-center gap-2 text-sm"
    >
      <FileText :size="16" class="text-slate-400 shrink-0" />
      <a v-if="modelValue" :href="modelValue" target="_blank" class="truncate hover:text-accent-500 hover:underline">{{ fileName }}</a>
      <span v-else class="text-slate-400">Belum ada file</span>
    </div>

    <button
      type="button"
      :disabled="uploading"
      class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:border-accent-500 hover:text-accent-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      @click="fileInput?.click()"
    >
      <Loader2 v-if="uploading" :size="14" class="animate-spin" />
      <Upload v-else :size="14" />
      {{ uploading ? 'Mengunggah...' : 'Upload' }}
    </button>
    <input ref="fileInput" type="file" :accept="accept" class="hidden" @change="handleFileChange" />
  </div>
</template>
