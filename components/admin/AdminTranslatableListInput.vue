<script setup lang="ts">
import { Plus, X } from 'lucide-vue-next'

interface Props {
  modelValue: { id: string; en: string }[]
  type?: 'input' | 'textarea'
}

const props = withDefaults(defineProps<Props>(), { type: 'input' })
const emit = defineEmits<{ 'update:modelValue': [value: { id: string; en: string }[]] }>()

const inputClass = 'w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'

function update(index: number, lang: 'id' | 'en', value: string) {
  const next = props.modelValue.map((item, i) => i === index ? { ...item, [lang]: value } : item)
  emit('update:modelValue', next)
}

function add() {
  emit('update:modelValue', [...props.modelValue, { id: '', en: '' }])
}

function remove(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}
</script>

<template>
  <div class="space-y-2">
    <div v-for="(item, i) in modelValue" :key="i" class="flex gap-2 items-start">
      <div class="flex-1 grid sm:grid-cols-2 gap-2">
        <textarea
          v-if="type === 'textarea'"
          :value="item.id"
          rows="2"
          placeholder="Indonesia"
          :class="inputClass"
          @input="update(i, 'id', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          type="text"
          :value="item.id"
          placeholder="Indonesia"
          :class="inputClass"
          @input="update(i, 'id', ($event.target as HTMLInputElement).value)"
        />
        <textarea
          v-if="type === 'textarea'"
          :value="item.en"
          rows="2"
          placeholder="English"
          :class="inputClass"
          @input="update(i, 'en', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          type="text"
          :value="item.en"
          placeholder="English"
          :class="inputClass"
          @input="update(i, 'en', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <button type="button" class="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0" @click="remove(i)">
        <X :size="15" />
      </button>
    </div>
    <button
      type="button"
      class="flex items-center gap-1.5 text-sm font-medium text-accent-500 hover:text-accent-600"
      @click="add"
    >
      <Plus :size="14" /> Tambah
    </button>
  </div>
</template>
