<script setup lang="ts">
interface Props {
  text: string
  required?: boolean
}

withDefaults(defineProps<Props>(), { required: false })
</script>

<template>
  <label class="block text-sm font-medium mb-1.5">
    {{ text }}<span v-if="required" class="text-red-500 ml-0.5">*</span>
  </label>
</template>
