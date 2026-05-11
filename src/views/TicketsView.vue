<template>
  <div class="view">
    <div class="view-header">
      <div>
        <h2 class="view-title">Tickets</h2>
        <p class="view-sub">{{ ticketsStore.tickets.length }} ticket(s) en total</p>
      </div>
      <Button v-if="auth.isUser" label="Nuevo ticket" icon="pi pi-plus" @click="openCreate" />
    </div>

    <div class="stats-row">
      <StatCard label="Abiertos"    :value="ticketsStore.openCount"       icon="pi pi-circle"       color="var(--cd-status-open)" />
      <StatCard label="En progreso" :value="ticketsStore.inProgressCount" icon="pi pi-spinner"      color="var(--cd-status-inprogress)" />
      <StatCard label="Cerrados"    :value="ticketsStore.closedCount"     icon="pi pi-check-circle" color="var(--cd-status-closed)" />
    </div>

    <DataTable
      :value="ticketsStore.tickets"
      :loading="ticketsStore.loading"
      paginator :rows="10"
      striped-rows
      v-model:filters="filters"
      filter-display="row"
      :global-filter-fields="['title', 'description', 'status']"
      empty-message="No hay tickets. ¡Crea el primero!"
    >
      <template #header>
        <div class="table-header">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar tickets…" />
          </IconField>
        </div>
      </template>

      <Column field="id" header="ID" sortable style="width:70px">
        <template #body="{ data }">
          <span class="mono text-muted">#{{ data.id }}</span>
        </template>
      </Column>

      <Column field="title" header="Título" sortable />

      <Column field="urgency" header="Urgencia" sortable style="width:130px">
        <template #body="{ data }">
          <Tag :value="data.urgency ?? 'Baja'" :severity="urgencySeverity(data.urgency ?? 'Baja')" />
        </template>
      </Column>
      
      <Column field="status" header="Estado" sortable style="width:200px">
        <template #body="{ data }">
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap">
            <Tag :value="getStatusMeta(data.status).label" :severity="getStatusMeta(data.status).severity" />
          </div>
        </template>
      </Column>

      <Column field="createdAt" header="Creado" sortable style="width:170px">
        <template #body="{ data }">
          <span class="text-muted" style="font-size:0.82rem">{{ formatDate(data.createdAt) }}</span>
        </template>
      </Column>

      <Column header="Acciones" style="width:140px">
        <template #body="{ data }">
          <div class="row-actions">
            <Button v-if="auth.canChangeStatus" icon="pi pi-refresh" text rounded size="small" v-tooltip.top="'Cambiar estado'" @click="openStatusDialog(data)" />
            <Button v-if="auth.canDeleteTicket" icon="pi pi-trash" text rounded size="small" severity="danger" v-tooltip.top="'Eliminar'" @click="confirmDelete(data)" />
          </div>
        </template>
      </Column>
    </DataTable>


    <Dialog v-model:visible="showCreate" header="Nuevo ticket" modal :style="{ width: '480px' }">
      <div class="dialog-form">
        <div class="field">
          <label>Título</label>
          <InputText v-model="newTicket.title" placeholder="Describe brevemente el problema" fluid />
        </div>
        <div class="field">
          <label>Descripción</label>
          <Textarea v-model="newTicket.description" rows="4" placeholder="Detalla el problema…" fluid />
        </div>
        <div class="field">
          <label>Urgencia</label>
          <Select
            v-model="newTicket.urgency"
            :options="urgencyOptions"
            option-label="label"
            option-value="value"
            placeholder="Selecciona urgencia"
            fluid
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showCreate = false" />
        <Button label="Crear ticket" icon="pi pi-send" :loading="creating" @click="handleCreate" />
      </template>
    </Dialog>


    <Dialog v-model:visible="showStatus" header="Actualizar estado" modal :style="{ width: '380px' }">
      <div class="dialog-form">
        <div class="field">
          <label>Ticket: <strong>{{ selectedTicket?.title }}</strong></label>
          <Select v-model="newStatus" :options="STATUS_OPTIONS" option-label="label" option-value="value" placeholder="Selecciona estado" fluid />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showStatus = false" />
        <Button label="Guardar" icon="pi pi-check" :loading="updating" @click="handleStatusUpdate" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useConfirm } from 'primevue/useconfirm'
import DataTable  from 'primevue/datatable'
import Column     from 'primevue/column'
import Button     from 'primevue/button'
import Tag        from 'primevue/tag'
import Dialog     from 'primevue/dialog'
import InputText  from 'primevue/inputtext'
import Textarea   from 'primevue/textarea'
import Select     from 'primevue/select'
import IconField  from 'primevue/iconfield'
import InputIcon  from 'primevue/inputicon'
import StatCard   from '@/components/ui/StatCard.vue'
import { useAuthStore }    from '@/stores/auth'
import { useTicketsStore } from '@/stores/tickets'
import { useTicketStatus } from '@/composables/useTicketStatus'
import { useNotify }       from '@/composables/useNotify'

const auth         = useAuthStore()
const ticketsStore = useTicketsStore()
const { STATUS_OPTIONS, getStatusMeta } = useTicketStatus()
const notify  = useNotify()
const confirm = useConfirm()

const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } })

const showCreate = ref(false)
const creating   = ref(false)
const newTicket  = reactive({ title: '', description: '', urgency: 'Baja' })

const showStatus     = ref(false)
const updating       = ref(false)
const selectedTicket = ref(null)
const newStatus      = ref('')

const urgencyOptions = [
  { label: 'Baja',  value: 'Baja' },
  { label: 'Media', value: 'Media' },
  { label: 'Alta',  value: 'Alta' }
]

onMounted(() => ticketsStore.fetchAll())

function formatDate(iso) {
  return new Date(iso).toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' })
}

function openCreate() {
  newTicket.title = ''
  newTicket.description = ''
  newTicket.urgency = 'Baja'
  showCreate.value = true
}

async function handleCreate() {
  if (!newTicket.title.trim()) return notify.warn('El título es requerido')
  creating.value = true
  try {
    await ticketsStore.create({ ...newTicket, userId: auth.user?.id })
    notify.success('Ticket creado correctamente')
    showCreate.value = false
  } catch {
    notify.error('No se pudo crear el ticket')
  } finally {
    creating.value = false
  }
}

function openStatusDialog(ticket) {
  selectedTicket.value = ticket
  newStatus.value      = ticket.status
  showStatus.value     = true
}

async function handleStatusUpdate() {
  if (!newStatus.value) return
  updating.value = true
  try {
    await ticketsStore.updateStatus(selectedTicket.value.id, newStatus.value)
    notify.success('Estado actualizado')
    showStatus.value = false
  } catch {
    notify.error('No se pudo actualizar el estado')
  } finally {
    updating.value = false
  }
}

function confirmDelete(ticket) {
  confirm.require({
    message: `¿Eliminar el ticket "${ticket.title}"?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Eliminar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await ticketsStore.remove(ticket.id)
        notify.success('Ticket eliminado')
      } catch {
        notify.error('No se pudo eliminar el ticket')
      }
    }
  })
}

function urgencySeverity(urgency) {
  return { Baja: 'success', Media: 'warn', Alta: 'danger' }[urgency] ?? 'secondary'
}

</script>

<style scoped>
.view { display: flex; flex-direction: column; gap: 1.75rem; }
.view-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.view-title { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
.view-sub   { font-size: 0.85rem; color: var(--cd-text-muted); margin-top: 0.2rem; }
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.table-header { display: flex; justify-content: flex-end; }
.row-actions { display: flex; gap: 0.25rem; }
.dialog-form { display: flex; flex-direction: column; gap: 1.25rem; padding-block: 0.5rem; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field label { font-size: 0.82rem; font-weight: 500; color: var(--cd-text-muted); }
</style>
