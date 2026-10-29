<script setup lang="ts">
import { Upload, Image as ImageIcon, FileText, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { apiFetch } from '~/services/apiClient'

const props = defineProps<{
  modelValue: string
  accept: string
  endpoint: string
  kind: 'image' | 'document'
  // Only meaningful for kind="image" — document uploads (CV PDFs) skip the
  // crop step entirely since there's nothing to crop.
  aspectRatio?: number
  shape?: 'circle' | 'rectangle'
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const pendingFile = ref<File | null>(null)

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (props.kind === 'image' && props.aspectRatio) {
    pendingFile.value = file
  } else {
    upload(file)
  }
}

async function upload(fileOrBlob: File | Blob) {
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', fileOrBlob, fileOrBlob instanceof File ? fileOrBlob.name : 'cropped')
    const result = await apiFetch<{ url: string }>(props.endpoint, { method: 'POST', body: formData })
    emit('update:modelValue', result.url)
  } catch {
    toast.error('Upload gagal. Cek ukuran/tipe file dan coba lagi.')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function handleCropped(blob: Blob) {
  pendingFile.value = null
  upload(blob)
}

function handleCropCancelled() {
  pendingFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const fileName = computed(() => props.modelValue.split('/').pop())
</script>

<template>
  <div class="space-y-2">
    <div
      v-if="kind === 'image'"
      class="w-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700"
      :class="shape === 'circle' ? 'rounded-full' : 'rounded-lg'"
      :style="{ aspectRatio: String(aspectRatio ?? 16 / 9) }"
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

    <AdminImageCropModal
      :file="pendingFile"
      :aspect-ratio="aspectRatio ?? 1"
      :shape="shape"
      @cropped="handleCropped"
      @cancel="handleCropCancelled"
    />
  </div>
</template>
