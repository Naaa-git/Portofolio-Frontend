<script setup lang="ts">
import { toast } from 'vue-sonner'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'

interface Props {
  modelValue: { id: string; en: string }
  label: string
  required?: boolean
  maxlength?: number
  errorId?: string
  errorEn?: string
}

const props = withDefaults(defineProps<Props>(), { required: false })
const emit = defineEmits<{ 'update:modelValue': [value: { id: string; en: string }] }>()

const richTextWrapperClass = 'rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-accent-500'
const richTextEditorClass = 'prose prose-sm dark:prose-invert max-w-none px-4 py-2.5 text-sm focus:outline-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1'

function update(lang: 'id' | 'en', html: string) {
  emit('update:modelValue', { ...props.modelValue, [lang]: html })
}

function makeExtensions() {
  return [
    StarterKit.configure({ heading: false, blockquote: false, codeBlock: false, horizontalRule: false }),
    ...(props.maxlength ? [CharacterCount.configure({ limit: props.maxlength })] : []),
  ]
}

// CharacterCount's `limit` blocks the whole paste transaction once it would
// overflow (no truncation) — this intercepts paste just to surface *why*
// nothing happened, then lets the same block occur via the extension itself.
function handlePasteOverLimit(view: { state: { doc: { textContent: string }; selection: { empty: boolean; from: number; to: number } } }, event: ClipboardEvent): boolean {
  if (!props.maxlength) return false
  const pasted = event.clipboardData?.getData('text/plain') ?? ''
  if (!pasted) return false
  const removed = view.state.selection.empty ? 0 : (view.state.selection.to - view.state.selection.from)
  const projected = view.state.doc.textContent.length - removed + pasted.length
  if (projected > props.maxlength) {
    toast.error(`Teks yang di-paste kepanjangan (maksimal ${props.maxlength} karakter) — paste dibatalkan.`)
    return true
  }
  return false
}

const editorId = useEditor({
  content: props.modelValue.id,
  extensions: makeExtensions(),
  editorProps: { attributes: { class: richTextEditorClass }, handlePaste: handlePasteOverLimit },
  onUpdate: ({ editor }) => update('id', editor.isEmpty ? '' : editor.getHTML()),
})

const editorEn = useEditor({
  content: props.modelValue.en,
  extensions: makeExtensions(),
  editorProps: { attributes: { class: richTextEditorClass }, handlePaste: handlePasteOverLimit },
  onUpdate: ({ editor }) => update('en', editor.isEmpty ? '' : editor.getHTML()),
})

watch(() => props.modelValue.id, (value) => {
  if (editorId.value && value !== editorId.value.getHTML() && !(value === '' && editorId.value.isEmpty)) {
    editorId.value.commands.setContent(value, false)
  }
})
watch(() => props.modelValue.en, (value) => {
  if (editorEn.value && value !== editorEn.value.getHTML() && !(value === '' && editorEn.value.isEmpty)) {
    editorEn.value.commands.setContent(value, false)
  }
})

const countId = computed(() => editorId.value?.storage.characterCount?.characters() ?? props.modelValue.id.length)
const countEn = computed(() => editorEn.value?.storage.characterCount?.characters() ?? props.modelValue.en.length)
</script>

<template>
  <div>
    <AdminLabel :text="label" :required="required" />
    <div class="grid sm:grid-cols-2 gap-3">
      <div>
        <span class="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1 block">Indonesia</span>
        <div :class="errorInputClass(richTextWrapperClass, errorId)">
          <AdminRichTextToolbar :editor="editorId" />
          <EditorContent :editor="editorId" />
        </div>
        <AdminFieldError :message="errorId" />
        <AdminCharCounter v-if="maxlength" :count="countId" :max="maxlength" />
      </div>
      <div>
        <span class="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1 block">English</span>
        <div :class="errorInputClass(richTextWrapperClass, errorEn)">
          <AdminRichTextToolbar :editor="editorEn" />
          <EditorContent :editor="editorEn" />
        </div>
        <AdminFieldError :message="errorEn" />
        <AdminCharCounter v-if="maxlength" :count="countEn" :max="maxlength" />
      </div>
    </div>
  </div>
</template>
