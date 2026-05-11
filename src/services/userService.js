import http from './http'

export const userService = {
  getAll() {
    return http.get('/users')
  },
  getMe() {
    return http.get('/users/profile')
  },
  remove(id) {
    return http.delete(`/users/${id}`)
  }
}

