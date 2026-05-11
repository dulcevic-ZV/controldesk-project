export function useTicketStatus() {
  const STATUS_OPTIONS = [
    { label: 'Abierto',     value: 'Open' },
    { label: 'En progreso', value: 'InProgress' },
    { label: 'Cerrado',     value: 'Closed' }
  ]

  const STATUS_META = {
    Open:       { label: 'Abierto',     severity: 'info',    icon: 'pi pi-circle' },
    InProgress: { label: 'En progreso', severity: 'warning', icon: 'pi pi-spinner' },
    Closed:     { label: 'Cerrado',     severity: 'success', icon: 'pi pi-check-circle' }
  }

  function getStatusMeta(status) {
    return STATUS_META[status] ?? { label: status, severity: 'secondary', icon: 'pi pi-question' }
  }

  return { STATUS_OPTIONS, STATUS_META, getStatusMeta }
}

