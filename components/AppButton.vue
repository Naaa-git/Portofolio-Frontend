<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer select-none'

const variantClasses = {
  primary: 'bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:-translate-y-0.5',
  secondary: 'glass text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 hover:-translate-y-0.5',
  ghost: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5',
  outline: 'border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-accent-500 hover:text-accent-500 hover:-translate-y-0.5',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const classes = computed(() => [
  baseClasses,
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
])

const tag = computed(() => props.href ? 'a' : 'button')
const linkProps = computed(() => props.href ? {
  href: props.href,
  target: props.external ? '_blank' : undefined,
  rel: props.external ? 'noopener noreferrer' : undefined,
} : {
  type: props.type,
})
</script>

<template>
  <component :is="tag" v-bind="linkProps" :class="classes" :disabled="!href ? disabled : undefined">
    <slot />
  </component>
</template>
