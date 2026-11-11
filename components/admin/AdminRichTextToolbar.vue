<script setup lang="ts">
import { Bold, Italic, List, ListOrdered } from 'lucide-vue-next'
import type { Editor } from '@tiptap/vue-3'

defineProps<{ editor: Editor | undefined }>()

const buttonClass = (active: boolean) =>
  `p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${active ? 'text-accent-500 bg-slate-200 dark:bg-slate-700' : 'text-slate-500'}`
</script>

<template>
  <div v-if="editor" class="flex items-center gap-0.5 px-2 pt-2 border-b border-slate-200 dark:border-slate-700 pb-1.5">
    <button
      type="button" :class="buttonClass(editor.isActive('bold'))"
      @click="editor.chain().focus().toggleBold().run()"
    >
      <Bold :size="14" />
    </button>
    <button
      type="button" :class="buttonClass(editor.isActive('italic'))"
      @click="editor.chain().focus().toggleItalic().run()"
    >
      <Italic :size="14" />
    </button>
    <button
      type="button" :class="buttonClass(editor.isActive('bulletList'))"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      <List :size="14" />
    </button>
    <button
      type="button" :class="buttonClass(editor.isActive('orderedList'))"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      <ListOrdered :size="14" />
    </button>
  </div>
</template>
