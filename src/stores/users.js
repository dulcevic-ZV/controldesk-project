import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/services/userService'

export const useUsersStore = defineStore('users', () => {
  const users   = ref([])
  const profile = ref(null)
  const loading = ref(false)
  const error   = ref(null)

  async function fetchAll() {
    loading.value = true
    error.value   = null
    try {
      const { data } = await userService.getAll()
      users.value    = data
    } catch (e) {
      error.value = e.response?.data?.message ?? 'Error al cargar usuarios'
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    const { data } = await userService.getMe()
    profile.value  = data
    return data
  }

  async function remove(id) {
    await userService.remove(id)
    users.value = users.value.filter(u => u.id !== id)
  }

  return { users, profile, loading, error, fetchAll, fetchMe, remove }
})
