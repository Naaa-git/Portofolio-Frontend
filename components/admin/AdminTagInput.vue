<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{ modelValue: string[]; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const draft = ref('')

function addTag() {
  const value = draft.value.trim()
  if (value && !props.modelValue.includes(value)) {
    emit('update:modelValue', [...props.modelValue, value])
  }
  draft.value = ''
}

function removeTag(tag: string) {
  emit('update:modelValue', props.modelValue.filter(t => t !== tag))
}
</script>

<template>
  <div class="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-accent-500">
    <span
      v-for="tag in modelValue"
      :key="tag"
      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent-500/10 text-accent-600 dark:text-accent-400"
    >
      {{ tag }}
      <button type="button" class="hover:text-red-500" @click="removeTag(tag)">
        <X :size="12" />
      </button>
    </span>
    <input
      v-model="draft"
      type="text"
      :placeholder="placeholder ?? 'Ketik lalu Enter'"
      class="flex-1 min-w-[100px] bg-transparent text-sm focus:outline-none px-1 py-0.5"
      @keydown.enter.prevent="addTag"
      @keydown.,.prevent="addTag"
      @blur="addTag"
    />
  </div>
</template>
