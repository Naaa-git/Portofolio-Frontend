<script setup lang="ts">
interface Props {
  id?: string
  class?: string
}

defineProps<Props>()
</script>

<template>
  <section :id="id" class="section-padding">
    <div class="container-max">
      <slot />
    </div>
  </section>
</template>
