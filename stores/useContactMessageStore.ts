import { defineStore } from 'pinia'
import { contactService } from '~/services/contactService'
import type { ContactMessageAdmin } from '~/types'

export const useContactMessageStore = defineStore('contactMessages', () => {
  const adminMessages = ref<ContactMessageAdmin[]>([])
  const isAdminLoaded = ref(false)

  async function loadAllAdmin() {
    if (isAdminLoaded.value) return
    adminMessages.value = await contactService.getAllAdmin()
    isAdminLoaded.value = true
  }

  async function deleteMessage(id: number) {
    await contactService.remove(id)
    adminMessages.value = adminMessages.value.filter(m => m.id !== id)
  }

  return { adminMessages, loadAllAdmin, deleteMessage }
})
