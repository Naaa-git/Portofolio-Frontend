<script setup lang="ts">
interface Props {
  variant?: 'default' | 'accent' | 'success' | 'muted'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const variantClasses = {
  default: 'bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-400',
  accent: 'bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  muted: 'bg-slate-50 dark:bg-white/4 text-slate-500 dark:text-slate-500',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantClasses[variant],
    ]"
  >
    <slot />
  </span>
</template>
