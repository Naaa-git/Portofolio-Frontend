<script setup lang="ts">
interface Props {
  modelValue: { id: string; en: string }
  label: string
  type?: 'input' | 'textarea'
  rows?: number
  required?: boolean
  maxlength?: number
  errorId?: string
  errorEn?: string
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
    <AdminLabel :text="label" :required="required" />
    <div class="grid sm:grid-cols-2 gap-3">
      <div>
        <span class="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1 block">Indonesia</span>
        <textarea
          v-if="type === 'textarea'"
          :value="modelValue.id"
          :rows="rows"
          :maxlength="maxlength"
          :class="errorInputClass(inputClass, errorId)"
          @input="update('id', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          type="text"
          :value="modelValue.id"
          :maxlength="maxlength"
          :class="errorInputClass(inputClass, errorId)"
          @input="update('id', ($event.target as HTMLInputElement).value)"
        />
        <AdminFieldError :message="errorId" />
        <AdminCharCounter v-if="maxlength" :count="modelValue.id.length" :max="maxlength" />
      </div>
      <div>
        <span class="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1 block">English</span>
        <textarea
          v-if="type === 'textarea'"
          :value="modelValue.en"
          :rows="rows"
          :maxlength="maxlength"
          :class="errorInputClass(inputClass, errorEn)"
          @input="update('en', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          type="text"
          :value="modelValue.en"
          :maxlength="maxlength"
          :class="errorInputClass(inputClass, errorEn)"
          @input="update('en', ($event.target as HTMLInputElement).value)"
        />
        <AdminFieldError :message="errorEn" />
        <AdminCharCounter v-if="maxlength" :count="modelValue.en.length" :max="maxlength" />
      </div>
    </div>
  </div>
</template>
