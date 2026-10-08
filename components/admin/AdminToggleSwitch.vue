<script setup lang="ts">
defineProps<{ modelValue: boolean; label?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label class="flex items-center gap-2.5 cursor-pointer select-none w-fit">
    <button
      type="button"
      :class="[
        'relative w-10 h-6 rounded-full transition-colors shrink-0',
        modelValue ? 'bg-accent-500' : 'bg-slate-300 dark:bg-slate-700',
      ]"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        :class="[
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform',
          modelValue ? 'translate-x-4' : 'translate-x-0',
        ]"
      />
    </button>
    <span v-if="label" class="text-sm">{{ label }}</span>
  </label>
</template>
