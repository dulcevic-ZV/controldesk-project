<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-brand">
        <img src="/IMG_0608.png" alt="ControlDesk logo" class="auth-brand__icon" />
        <h1 class="auth-brand__title">ControlDesk</h1>
        <p class="auth-brand__sub">Plataforma de soporte técnico</p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="field">
          <label for="email">Correo electrónico</label>
          <InputText id="email" v-model="form.email" type="email" placeholder="tu@empresa.com" :disabled="loading" fluid />
        </div>

        <div class="field">
          <label for="password">Contraseña</label>
          <Password id="password" v-model="form.password" placeholder="••••••••" :feedback="false" toggleMask :disabled="loading" fluid />
        </div>

        <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>

        <Button type="submit" label="Iniciar sesión" icon="pi pi-sign-in" :loading="loading" fluid />
      </form>

      <p class="auth-footer">
        ¿No tienes cuenta?
        <RouterLink to="/register">Regístrate</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password  from 'primevue/password'
import Button    from 'primevue/button'
import Message   from 'primevue/message'
import { useAuthStore } from '@/stores/auth'

const auth    = useAuthStore()
const router  = useRouter()
const route   = useRoute()

const form     = reactive({ email: '', password: '' })
const loading  = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  loading.value  = true
  try {
    await auth.login({ email: form.email, password: form.password })
    const redirect = route.query.redirect ?? '/tickets'
    router.push(redirect)
  } catch (e) {
    errorMsg.value = e.response?.data?.message ?? 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--cd-bg);
  background-image: radial-gradient(ellipse 60% 50% at 50% -10%, rgba(91,141,239,0.15) 0%, transparent 70%);
}
.auth-card {
  width: 100%; max-width: 400px; padding: 2.5rem;
  background: var(--cd-surface);
  border: 1px solid var(--cd-border);
  border-radius: var(--cd-radius-lg);
  box-shadow: var(--cd-shadow);
  display: flex; flex-direction: column; gap: 2rem;
}
.auth-brand { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.auth-brand__icon {
  width: 52px; height: 52px; background: var(--cd-accent);
  border-radius: var(--cd-radius); display: grid; place-items: center;
  font-size: 1.4rem; color: #fff; margin-bottom: 0.25rem;
}
.auth-brand__title { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.03em; }
.auth-brand__sub { font-size: 0.85rem; color: var(--cd-text-muted); }
.auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field label { font-size: 0.82rem; font-weight: 500; color: var(--cd-text-muted); }
.auth-footer { text-align: center; font-size: 0.85rem; color: var(--cd-text-muted); }
.auth-footer a { color: var(--cd-accent); text-decoration: none; font-weight: 500; }
.auth-footer a:hover { text-decoration: underline; }
.auth-brand__icon {
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: var(--cd-radius);
  background: transparent;
}
</style>
