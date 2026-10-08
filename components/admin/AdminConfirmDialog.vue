<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  message: string
}

withDefaults(defineProps<Props>(), {
  title: 'Konfirmasi',
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="emit('cancel')" />

      <div class="relative w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-5">
        <h2 class="font-semibold mb-2">{{ title }}</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-5">{{ message }}</p>
        <div class="flex justify-end gap-2">
          <AppButton variant="ghost" size="sm" @click="emit('cancel')">Batal</AppButton>
          <AppButton
            size="sm"
            class="!bg-red-500 hover:!bg-red-600 !shadow-red-500/25"
            @click="emit('confirm')"
          >
            Hapus
          </AppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
