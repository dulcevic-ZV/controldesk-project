import { useToast } from 'primevue/usetoast'

export function useNotify() {
  const toast = useToast()

  const success = (msg, title = 'Éxito') =>
    toast.add({ severity: 'success', summary: title, detail: msg, life: 3500 })

  const error = (msg, title = 'Error') =>
    toast.add({ severity: 'error', summary: title, detail: msg, life: 5000 })

  const warn = (msg, title = 'Atención') =>
    toast.add({ severity: 'warn', summary: title, detail: msg, life: 4000 })

  const info = (msg, title = 'Info') =>
    toast.add({ severity: 'info', summary: title, detail: msg, life: 3500 })

  return { success, error, warn, info }
}
