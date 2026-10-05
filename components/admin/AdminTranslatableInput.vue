<script setup lang="ts">
interface Props {
  modelValue: { id: string; en: string }
  label: string
  type?: 'input' | 'textarea'
  rows?: number
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), { type: 'input', rows: 3, required: false })
const emit = defineEmits<{ 'update:modelValue': [value: { id: string; en: string }] }>()

function update(lang: 'id' | 'en', value: string) {
  emit('update:modelValue', { ...props.modelValue, [lang]: value })
}

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'
</script>

<template>
  <div>
    <label class="block text-sm font-medium mb-1.5">{{ label }}</label>
    <div class="grid sm:grid-cols-2 gap-3">
      <div>
        <span class="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1 block">Indonesia</span>
        <textarea
          v-if="type === 'textarea'"
          :value="modelValue.id"
          :rows="rows"
          :required="required"
          :class="inputClass"
          @input="update('id', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          type="text"
          :value="modelValue.id"
          :required="required"
          :class="inputClass"
          @input="update('id', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div>
        <span class="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1 block">English</span>
        <textarea
          v-if="type === 'textarea'"
          :value="modelValue.en"
          :rows="rows"
          :required="required"
          :class="inputClass"
          @input="update('en', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          type="text"
          :value="modelValue.en"
          :required="required"
          :class="inputClass"
          @input="update('en', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>
