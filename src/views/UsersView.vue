<template>
  <div class="view">
    <div class="view-header">
      <div>
        <h2 class="view-title">Usuarios</h2>
        <p class="view-sub">{{ usersStore.users.length }} usuario(s) registrados</p>
      </div>
    </div>

    <DataTable
      :value="usersStore.users"
      :loading="usersStore.loading"
      paginator
      :rows="10"
      striped-rows
      empty-message="No hay usuarios registrados"
    >
      <Column field="id" header="ID" sortable style="width:70px">
        <template #body="{ data }">
          <span class="mono text-muted">#{{ data.id }}</span>
        </template>
      </Column>

      <Column field="name" header="Nombre" sortable>
        <template #body="{ data }">
          <div class="user-cell">
            <span class="user-avatar">{{ initials(data.name) }}</span>
            <span>{{ data.name }}</span>
          </div>
        </template>
      </Column>

      <Column field="email" header="Email" sortable />

      <Column field="role" header="Rol" sortable style="width:130px">
        <template #body="{ data }">
          <Tag :value="data.role" :severity="roleSeverity(data.role)" />
        </template>
      </Column>

      <Column header="Acciones" style="width:100px">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            text rounded size="small"
            severity="danger"
            v-tooltip.top="'Eliminar usuario'"
            @click="confirmDelete(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column    from 'primevue/column'
import Button    from 'primevue/button'
import Tag       from 'primevue/tag'
import { useUsersStore } from '@/stores/users'
import { useNotify }     from '@/composables/useNotify'

const usersStore = useUsersStore()
const notify     = useNotify()
const confirm    = useConfirm()

onMounted(() => usersStore.fetchAll())

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function roleSeverity(role) {
  return { Admin: 'danger', Support: 'warn', User: 'info' }[role] ?? 'secondary'
}

function confirmDelete(user) {
  confirm.require({
    message: `¿Eliminar al usuario "${user.name}"?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Eliminar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await usersStore.remove(user.id)
        notify.success('Usuario eliminado')
      } catch {
        notify.error('No se pudo eliminar el usuario')
      }
    }
  })
}
</script>

<style scoped>
.view { display: flex; flex-direction: column; gap: 1.75rem; }
.view-header { display: flex; align-items: flex-start; justify-content: space-between; }
.view-title { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
.view-sub   { font-size: 0.85rem; color: var(--cd-text-muted); margin-top: 0.2rem; }

.user-cell { display: flex; align-items: center; gap: 0.625rem; }
.user-avatar {
  width: 28px; height: 28px;
  background: var(--cd-accent-soft);
  color: var(--cd-accent);
  border-radius: 50%;
  display: grid; place-items: center;
  font-size: 0.68rem; font-weight: 700;
  flex-shrink: 0;
}
</style>