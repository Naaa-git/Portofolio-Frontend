<script setup lang="ts">
interface Props {
  headers: string[]
  empty?: string
  isEmpty?: boolean
}

withDefaults(defineProps<Props>(), {
  empty: 'Belum ada data.',
  isEmpty: false,
})

// Exposed so callers can attach drag-and-drop (useDraggable) to this exact
// element — needs a real DOM ref, not a wrapper component that renders its
// own element, since that would be invalid as a direct child of <tbody>.
const tbodyRef = ref<HTMLTableSectionElement | null>(null)
// A method, not the raw ref, to avoid relying on whether Vue auto-unwraps an
// exposed ref when accessed from the parent via a template ref.
defineExpose({ getTbody: () => tbodyRef.value })
</script>

<template>
  <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <th
            v-for="header in headers"
            :key="header"
            class="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody ref="tbodyRef" class="divide-y divide-slate-100 dark:divide-slate-800">
        <slot />
      </tbody>
    </table>
    <div v-if="isEmpty" class="text-center py-10 text-sm text-slate-500 dark:text-slate-500">
      {{ empty }}
    </div>
  </div>
</template>
