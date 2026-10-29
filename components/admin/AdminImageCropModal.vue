<script setup lang="ts">
import { Cropper, CircleStencil, RectangleStencil } from 'vue-advanced-cropper'

const props = defineProps<{
  file: File | null
  aspectRatio: number
  shape?: 'circle' | 'rectangle'
}>()
const emit = defineEmits<{ cropped: [blob: Blob]; cancel: [] }>()

const cropper = useTemplateRef('cropper')
const objectUrl = ref<string>()

watch(() => props.file, (file) => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = file ? URL.createObjectURL(file) : undefined
}, { immediate: true })

onUnmounted(() => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
})

function confirm() {
  const result = cropper.value?.getResult()
  const canvas = result?.canvas
  if (!canvas) return

  canvas.toBlob((blob) => {
    if (blob) emit('cropped', blob)
  }, props.file?.type || 'image/png')
}
</script>

<template>
  <AdminModal :show="!!file" title="Sesuaikan Gambar" @close="emit('cancel')">
    <div class="space-y-4">
      <Cropper
        v-if="objectUrl"
        ref="cropper"
        class="max-h-[60vh] bg-slate-100 dark:bg-slate-800 rounded-lg"
        :src="objectUrl"
        :stencil-component="shape === 'circle' ? CircleStencil : RectangleStencil"
        :stencil-props="{ aspectRatio }"
      />
      <div class="flex justify-end gap-2">
        <AppButton type="button" variant="ghost" size="sm" @click="emit('cancel')">Batal</AppButton>
        <AppButton type="button" size="sm" @click="confirm">Pakai</AppButton>
      </div>
    </div>
  </AdminModal>
</template>
