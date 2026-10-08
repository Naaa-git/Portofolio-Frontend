<script setup lang="ts">
import { Upload, Image as ImageIcon } from 'lucide-vue-next'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const fileInput = ref<HTMLInputElement>()

// Mock upload: no backend endpoint yet (waiting on Azure Blob Storage),
// so we just preview the picked file locally via an object URL. Once
// POST /api/images/upload exists, this becomes a real upload call that
// emits the returned URL instead.
function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const objectUrl = URL.createObjectURL(file)
  emit('update:modelValue', objectUrl)
}
</script>

<template>
  <div class="space-y-2">
    <div class="w-full aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
      <img v-if="modelValue" :src="modelValue" class="w-full h-full object-cover" />
      <ImageIcon v-else :size="28" class="text-slate-400" />
    </div>

    <div class="flex gap-2">
      <input
        v-model="props.modelValue"
        type="text"
        placeholder="https://... (atau upload file)"
        class="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:border-accent-500 hover:text-accent-500 transition-colors"
        @click="fileInput?.click()"
      >
        <Upload :size="14" /> Upload
      </button>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
    </div>
    <p class="text-xs text-amber-500">
      Preview lokal saja (belum diupload ke storage, nunggu integrasi Azure Blob) — kalau disimpan,
      URL ini cuma valid di browser & sesi ini. Pakai input URL manual di atas kalau mau gambar
      yang benar-benar persist.
    </p>
  </div>
</template>
