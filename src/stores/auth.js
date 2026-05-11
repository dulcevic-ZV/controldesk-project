import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

const TOKEN_KEY = 'cd_token'
const USER_KEY  = 'cd_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) ?? null)
  const user  = ref(
    localStorage.getItem(USER_KEY)
      ? JSON.parse(localStorage.getItem(USER_KEY))
      : null
  )

  const isAuthenticated = computed(() => !!token.value)
  const role            = computed(() => user.value?.role ?? null)
  const isAdmin   = computed(() => role.value === 'ADMIN')
  const isSupport = computed(() => role.value === 'SUPPORT')
  const isUser    = computed(() => role.value === 'CLIENT')
  const canChangeStatus = computed(() => isAdmin.value || isSupport.value)
  const canDeleteTicket = computed(() => isAdmin.value)
  const canManageUsers  = computed(() => isAdmin.value)

  function _persist(rawToken) {
    token.value = rawToken
    const payload = JSON.parse(
      atob(rawToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    )
    user.value = {
      id:    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      name:  payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role:  payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    }
    localStorage.setItem(TOKEN_KEY, rawToken)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  async function login(credentials) {
    const { data } = await authService.login(credentials)
    _persist(data.token)
    return user.value
  }

  async function register(payload) {
    const { data } = await authService.register(payload)
    _persist(data.token)
    return user.value
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    token, user,
    isAuthenticated, role,
    isAdmin, isSupport, isUser,
    canChangeStatus, canDeleteTicket, canManageUsers,
    login, register, logout
  }
})

