<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <img src="/IMG_0608.png" alt="ControlDesk logo" class="brand-icon" />
        <span class="brand-name">ControlDesk</span>
      </div>

      <nav class="sidebar__nav">
        <RouterLink to="/tickets" class="nav-item" active-class="nav-item--active">
          <i class="pi pi-ticket" />
          <span>Tickets</span>
        </RouterLink>

        <RouterLink v-if="auth.canManageUsers" to="/users" class="nav-item" active-class="nav-item--active">
          <i class="pi pi-users" />
          <span>Usuarios</span>
        </RouterLink>

        <RouterLink to="/profile" class="nav-item" active-class="nav-item--active">
          <i class="pi pi-user" />
          <span>Mi perfil</span>
        </RouterLink>
      </nav>

      <div class="sidebar__footer">
        <div class="user-chip">
          <span class="user-chip__avatar">{{ initials }}</span>
          <div class="user-chip__info">
            <span class="user-chip__name">{{ auth.user?.name }}</span>
            <span class="user-chip__role">{{ auth.role }}</span>
          </div>
        </div>
        <Button icon="pi pi-sign-out" text rounded severity="secondary" v-tooltip.top="'Cerrar sesión'" @click="handleLogout" />
      </div>
    </aside>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/auth'

const auth   = useAuthStore()
const router = useRouter()

const initials = computed(() => {
  const name = auth.user?.name ?? ''
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.shell { display: flex; min-height: 100vh; }

.sidebar {
  width: 230px; flex-shrink: 0;
  background: var(--cd-surface);
  border-right: 1px solid var(--cd-border);
  display: flex; flex-direction: column;
  padding: 1.5rem 1rem; gap: 2rem;
  position: sticky; top: 0; height: 100vh;
}
.sidebar__brand { display: flex; align-items: center; gap: 0.75rem; padding: 0 0.5rem; }
.brand-icon {
  width: 36px; height: 36px; background: var(--cd-accent);
  border-radius: var(--cd-radius-sm); display: grid; place-items: center;
  color: #fff; font-size: 1rem;
}
.brand-name { font-size: 1.1rem; font-weight: 700; letter-spacing: -0.02em; }

.sidebar__nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
.nav-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.625rem 0.875rem; border-radius: var(--cd-radius-sm);
  color: var(--cd-text-muted); text-decoration: none;
  font-size: 0.9rem; font-weight: 500; transition: background 0.15s, color 0.15s;
}
.nav-item:hover { background: var(--cd-surface-2); color: var(--cd-text); }
.nav-item--active { background: var(--cd-accent-soft); color: var(--cd-accent); }
.nav-item i { font-size: 1rem; width: 1rem; text-align: center; }

.sidebar__footer { display: flex; align-items: center; gap: 0.5rem; }
.user-chip { display: flex; align-items: center; gap: 0.625rem; flex: 1; min-width: 0; }
.user-chip__avatar {
  width: 32px; height: 32px; background: var(--cd-accent-soft);
  color: var(--cd-accent); border-radius: 50%;
  display: grid; place-items: center;
  font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
}
.user-chip__info { display: flex; flex-direction: column; min-width: 0; }
.user-chip__name { font-size: 0.82rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-chip__role { font-size: 0.72rem; color: var(--cd-text-muted); }

.main { flex: 1; padding: 2rem 2.5rem; min-width: 0; overflow-y: auto; }

.brand-icon {
  width: 42px;
  height: 42px;
  object-fit: contain;
  border-radius: var(--cd-radius-sm);
  background: transparent;
}
</style>

