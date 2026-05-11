import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ticketService } from '@/services/ticketService'

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref([])
  const loading = ref(false)
  const error   = ref(null)

  const byStatus = computed(() => (status) =>
    tickets.value.filter(t => t.status === status)
  )
  const openCount       = computed(() => byStatus.value('Open').length)
  const inProgressCount = computed(() => byStatus.value('InProgress').length)
  const closedCount     = computed(() => byStatus.value('Closed').length)

  async function fetchAll() {
    loading.value = true
    error.value   = null
    try {
      const { data } = await ticketService.getAll()
      tickets.value  = data
    } catch (e) {
      error.value = e.response?.data?.message ?? 'Error al cargar tickets'
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    const { data } = await ticketService.create(payload)
    tickets.value.unshift({ ...data, urgency: payload.urgency })
    return data
  }

  async function updateStatus(id, status) {
    await ticketService.updateStatus(id, status)
    const ticket = tickets.value.find(t => t.id === id)
    if (ticket) ticket.status = status
  }

  async function remove(id) {
    await ticketService.remove(id)
    tickets.value = tickets.value.filter(t => t.id !== id)
  }

  return {
    tickets, loading, error,
    byStatus, openCount, inProgressCount, closedCount,
    fetchAll, create, updateStatus, remove
  }
})
