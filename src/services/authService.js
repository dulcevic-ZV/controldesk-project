import http from './http'

export const authService = {
  register(payload) {
    return http.post('/auth/register', payload)
  },
  login(payload) {
    return http.post('/auth/login', payload)
  }
}
