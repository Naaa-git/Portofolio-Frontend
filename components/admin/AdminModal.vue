<script setup lang="ts">
import { X } from 'lucide-vue-next'

interface Props {
  show: boolean
  title: string
}

defineProps<Props>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="emit('close')" />

      <div class="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
          <h2 class="font-semibold">{{ title }}</h2>
          <button
            class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            @click="emit('close')"
          >
            <X :size="18" />
          </button>
        </div>

        <div class="p-5">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
