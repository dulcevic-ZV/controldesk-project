import http from './http'

export const ticketService = {
  getAll() {
    return http.get('/tickets')
  },
  create(payload) {
    return http.post('/tickets', payload)
  },
  updateStatus(id, status) {
    return http.put(`/tickets/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  remove(id) {
    return http.delete(`/tickets/${id}`)
  }
}

