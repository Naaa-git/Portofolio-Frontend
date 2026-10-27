<script setup lang="ts">
interface Props {
  count: number
  max: number
}

const props = defineProps<Props>()

const colorClass = computed(() => {
  if (props.count > props.max) return 'text-red-500'
  if (props.count >= props.max * 0.9) return 'text-amber-500'
  return 'text-slate-400 dark:text-slate-500'
})
</script>

<template>
  <span class="text-[11px] mt-1 block text-right" :class="colorClass">{{ count }}/{{ max }}</span>
</template>
