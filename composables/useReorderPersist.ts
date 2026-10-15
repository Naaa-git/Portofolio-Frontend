import { useDraggable } from 'vue-draggable-plus'
import { toast } from 'vue-sonner'
import type { Ref } from 'vue'

interface Sortable {
  id: number | string
  sortOrder: number
}

interface AdminTableInstance {
  getTbody: () => HTMLTableSectionElement | null
}

/**
 * Wires drag-and-drop reordering to an AdminTable's <tbody> and persists the
 * new order via an existing per-item update action — only for items whose
 * position actually changed, not the whole list on every drag.
 */
export function useReorderPersist<T extends Sortable>(
  tableRef: Ref<AdminTableInstance | null>,
  list: Ref<T[]>,
  persistOne: (item: T, newSortOrder: number) => Promise<void>,
) {
  let beforeDrag = new Map<T['id'], number>()

  const tbodyEl = computed(() => tableRef.value?.getTbody() ?? null)

  useDraggable(tbodyEl, list, {
    handle: '.drag-handle',
    animation: 150,
    onStart: () => {
      beforeDrag = new Map(list.value.map((item, index) => [item.id, index]))
    },
    onEnd: async () => {
      const changed = list.value
        .map((item, index) => ({ item, index }))
        .filter(({ item, index }) => beforeDrag.get(item.id) !== index)

      if (changed.length === 0) return

      try {
        await Promise.all(changed.map(({ item, index }) => persistOne(item, index)))
      } catch {
        toast.error('Gagal menyimpan urutan. Urutan dikembalikan ke semula.')
        list.value = [...list.value].sort(
          (a, b) => (beforeDrag.get(a.id) ?? 0) - (beforeDrag.get(b.id) ?? 0),
        )
      }
    },
  })
}
