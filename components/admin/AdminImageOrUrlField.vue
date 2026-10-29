<script setup lang="ts">
// Outside-code images are usually a link to a poster/cover hosted elsewhere
// (IMDB, Spotify, etc.), not a file of your own — but sometimes you do want
// to upload+crop one. Toggle between the two without losing what's typed.
withDefaults(defineProps<{
  modelValue: string
  label?: string
  error?: string
  aspectRatio: number
  shape?: 'circle' | 'rectangle'
}>(), { label: 'Image URL' })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const mode = ref<'link' | 'upload'>('link')

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'
const tabClass = (active: boolean) =>
  `px-2 py-0.5 rounded text-xs font-medium transition-colors ${active ? 'bg-accent-500 text-white' : 'text-slate-500 hover:text-accent-500'}`
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1.5">
      <AdminLabel :text="label" />
      <div class="flex gap-1">
        <button type="button" :class="tabClass(mode === 'link')" @click="mode = 'link'">Link</button>
        <button type="button" :class="tabClass(mode === 'upload')" @click="mode = 'upload'">Upload</button>
      </div>
    </div>

    <template v-if="mode === 'link'">
      <input
        :value="modelValue"
        type="url"
        maxlength="500"
        :class="errorInputClass(inputClass, error)"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <AdminFieldError :message="error" />
    </template>

    <AdminFileUploadField
      v-else
      :model-value="modelValue"
      accept="image/*"
      endpoint="/images/upload"
      kind="image"
      :aspect-ratio="aspectRatio"
      :shape="shape"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
