<template>
  <div class="login-page">
    <div class="animated-background"></div>

    <div class="container">
      <div class="login-header">
        <h1>Registro</h1>
        <p>Crea tu cuenta</p>
      </div>

      <!-- Selector de tipo -->
      <div class="type-selector">
        <button
          type="button"
          :class="{ active: form.type === 'client' }"
          @click="form.type = 'client'"
        >
          Persona Natural
        </button>
        <button
          type="button"
          :class="{ active: form.type === 'company' }"
          @click="form.type = 'company'"
        >
          Empresa
        </button>
      </div>

      <form class="login-form" @submit.prevent="handleRegister">
        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <!-- Campos Persona Natural -->
        <template v-if="form.type === 'client'">
          <div class="form-group">
            <input type="text" placeholder=" " v-model="form.name" required />
            <label>Nombre completo</label>
          </div>
          <div class="form-group">
            <input type="text" placeholder=" " v-model="form.username" required />
            <label>Username</label>
          </div>
          <div class="form-group">
            <input type="email" placeholder=" " v-model="form.email" required />
            <label>Correo electrónico</label>
          </div>
          <div class="form-group">
            <input type="password" placeholder=" " v-model="form.password" required />
            <label>Contraseña</label>
          </div>
          <div class="form-group">
            <input type="password" placeholder=" " v-model="form.password_confirmation" required />
            <label>Confirmar contraseña</label>
          </div>
        </template>

        <!-- Campos Empresa -->
        <template v-else>
          <div class="form-group">
            <input type="text" placeholder=" " v-model="form.company_name" required />
            <label>Nombre empresa</label>
          </div>
          <div class="form-group">
            <input type="text" placeholder=" " v-model="form.nit" required />
            <label>NIT</label>
          </div>
          <div class="form-group">
            <input type="text" placeholder=" " v-model="form.phone" required />
            <label>Teléfono</label>
          </div>
          <div class="form-group">
            <input type="text" placeholder=" " v-model="form.address" required />
            <label>Dirección</label>
          </div>
          <div class="form-group">
            <input type="email" placeholder=" " v-model="form.email" required />
            <label>Correo electrónico</label>
          </div>
          <div class="form-group">
            <input type="password" placeholder=" " v-model="form.password" required />
            <label>Contraseña</label>
          </div>
          <div class="form-group">
            <input type="password" placeholder=" " v-model="form.password_confirmation" required />
            <label>Confirmar contraseña</label>
          </div>
        </template>

        <button type="submit" class="login-button">
          <span v-if="!authStore.isLoading">Registrarse</span>
          <span v-else>Registrando...</span>
        </button>
      </form>


      <div class="signup-link">
        ¿Ya tienes cuenta?<a href="/login">Inicia sesión aquí</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.ts'

const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref('')

const form = reactive({
  type: 'client', // default: persona natural
  name: '',
  username: '',
  company_name: '',
  nit: '',
  phone: '',
  address: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const validateForm = () => {
  if (!form.email || !form.password || !form.password_confirmation) {
    errorMessage.value = 'Por favor completa todos los campos'
    return false
  }
  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return false
  }
  if (form.type === 'client' && (!form.name || !form.username)) {
    errorMessage.value = 'Por favor completa los datos de persona natural'
    return false
  }
  if (
    form.type === 'company' &&
    (!form.company_name || !form.nit || !form.phone || !form.address)
  ) {
    errorMessage.value = 'Por favor completa los datos de la empresa'
    return false
  }
  return true
}

const handleRegister = async () => {
  errorMessage.value = ''
  if (!validateForm()) return

  try {
    // 🔑 construimos payload según el tipo
    let payload: any = {
      type: form.type,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      name: form.type === 'client' ? form.name : form.company_name,
      username: form.type === 'client' ? form.username : form.nit
    }

    if (form.type === 'company') {
      payload.company_name = form.company_name
      payload.company_email = form.email
      payload.nit = form.nit
      payload.phone = form.phone
      payload.address = form.address
    }

    await authStore.register(payload)

    // ✅ Redirige a página de éxito
    router.push({ name: 'register.success', query: { type: form.type } })
  } catch (error: any) {
    console.error('❌ Backend error:', error.response?.data)

    if (error.response?.data?.errors) {
      const messages = Object.values(error.response.data.errors).flat()
      errorMessage.value = messages.join(', ')
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Ocurrió un error, intenta nuevamente'
    }
  }
}
</script>

<style>
@import '../../assets/css/login.css';
/* estilos iguales a los que ya tenías */
.type-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  gap: 10px;
}

.type-selector button {
  padding: 10px 20px;
  border-radius: 12px;
  border: 2px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.1);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-selector button.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: white;
}

.type-selector button:hover {
  background: rgba(255,255,255,0.2);
}

.error-message {
  color: #ff5252;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 500;
}
</style>
