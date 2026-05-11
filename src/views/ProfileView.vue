<template>
  <div class="view">
    <div class="view-header">
      <h2 class="view-title">Mi perfil</h2>
    </div>

    <div v-if="loading" class="loading-state">
      <ProgressSpinner style="width:40px;height:40px" />
    </div>

    <div v-else-if="profile" class="profile-card">
      <div class="profile-avatar">{{ initials }}</div>

      <div class="profile-info">
        <h3 class="profile-name">{{ profile.firstName }} {{ profile.lastName }}</h3>
        <p class="profile-email"><i class="pi pi-envelope" /> {{ profile.email }}</p>
        <Tag :value="profile.role" :severity="roleSeverity(profile.role)" style="margin-top:0.5rem" />
      </div>

      <Divider />

      <div class="profile-meta">
        <div class="meta-row">
          <span class="meta-label">ID de usuario</span>
          <span class="mono">{{ profile.id }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Rol</span>
          <span>{{ profile.role }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Tag             from 'primevue/tag'
import Divider         from 'primevue/divider'
import ProgressSpinner from 'primevue/progressspinner'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()
const loading    = ref(false)
const profile    = ref(null)

onMounted(async () => {
  loading.value = true
  try { profile.value = await usersStore.fetchMe() }
  finally { loading.value = false }
})

const initials = computed(() => {
  const first = profile.value?.firstName?.[0] ?? ''
  const last  = profile.value?.lastName?.[0] ?? ''
  return (first + last).toUpperCase()
})

function roleSeverity(role) {
  return { Admin: 'danger', Support: 'warn', User: 'info' }[role] ?? 'secondary'
}
</script>

<style scoped>
.view { display: flex; flex-direction: column; gap: 1.75rem; max-width: 500px; }
.view-title { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
.loading-state { display: grid; place-items: center; padding: 3rem; }
.profile-card {
  background: var(--cd-surface);
  border: 1px solid var(--cd-border);
  border-radius: var(--cd-radius-lg);
  padding: 2rem;
  display: flex; flex-direction: column; gap: 1.25rem;
}
.profile-avatar {
  width: 72px; height: 72px; background: var(--cd-accent);
  color: #fff; border-radius: 50%;
  display: grid; place-items: center;
  font-size: 1.5rem; font-weight: 700;
}
.profile-name  { font-size: 1.25rem; font-weight: 700; }
.profile-email { color: var(--cd-text-muted); font-size: 0.9rem; display: flex; align-items: center; gap: 0.4rem; }
.profile-meta  { display: flex; flex-direction: column; gap: 0.75rem; }
.meta-row      { display: flex; justify-content: space-between; align-items: center; }
.meta-label    { font-size: 0.82rem; color: var(--cd-text-muted); }
</style>

