<template>
  <div class="login-page">
    <!-- Fondo animado -->
    <div class="animated-background"></div>

    <!-- Contenedor del login -->
    <div class="container">
      <div class="login-header">
        <h1>Bienvenido</h1>
        <p>Inicia sesión en tu cuenta</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <input type="email" id="email" placeholder=" " required v-model="form.email" />
          <label for="email">Correo electrónico</label>
        </div>

        <div class="form-group">
          <input type="password" id="password" placeholder=" " required v-model="form.password" />
          <label for="password">Contraseña</label>
        </div>

        <div class="forgot-password">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" class="login-button">
          <span v-if="!authStore.isLoading">Iniciar Sesión</span>
          <span v-else>Iniciando sesión...</span>
        </button>
      </form>

      <div class="divider">
        <span>o continúa con</span>
      </div>

      <div class="social-login">
        <a href="#" class="social-button">Google</a>
        <a href="#" class="social-button">Facebook</a>
      </div>

      <div class="signup-link"><a href="/">Volver a Home</a></div>
      <div class="signup-link">
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </div>

    </div>
  </div>
</template>


<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { useAuthStore } from '../../stores/auth.ts'

const authStore = useAuthStore()
const errorMessage = ref('') // Estado para guardar el mensaje de error


const form = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  if (!form.email || !form.password) {
    alert('Por favor completa todos los campos')
    return false
  }
  return true
}

const handleLogin = async () => {
  errorMessage.value = '' // Limpiar mensaje previo
  if (!validateForm()) return

  try {
    await authStore.login({
      email: form.email,
      password: form.password
    })
    errorMessage.value = '' // ✅ Login exitoso

    // Mostrar loader y redirigir con reload
    setTimeout(() => {
      window.location.href = '/' // home
    }, 300) // 300ms para que se note la transición
  } catch (error: any) {
    if (error.response?.status === 401) {
      errorMessage.value = 'Usuario o contraseña incorrectos'
    } else {
      errorMessage.value = 'Ocurrió un error, intenta nuevamente'
    }
  }
}



// Cursor efecto partículas
onMounted(() => {
  document.addEventListener('mousemove', (e: MouseEvent) => {
    const cursor = document.createElement('div')
    cursor.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: rgba(255,255,255,0.6);
      border-radius: 50%;
      pointer-events: none;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      animation: cursorEffect 1s ease-out forwards;
      z-index: 9999;
    `
    const style = document.createElement('style')
    style.textContent = `
      @keyframes cursorEffect {
        to {
          opacity: 0;
          transform: scale(3);
        }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(cursor)
    setTimeout(() => {
      cursor.remove()
      style.remove()
    }, 1000)
  })
})
</script>

<style>
@import '../../assets/css/login.css';

.error-message {
  color: #ff5252;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 500;
}
</style>
