<template>
  <div class="success-page">
    <div class="success-card">
      <!-- Icono -->
      <div class="success-icon">
        <svg viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>

      <!-- Título -->
      <h2 class="success-title">🎉 ¡Registro exitoso!</h2>

      <!-- Mensaje -->
      <p v-if="type === 'client'" class="success-text">
        Tu cuenta ha sido creada.  
        Revisa tu correo electrónico para confirmar tu registro ✅
      </p>

      <p v-else class="success-text">
        Tu empresa fue registrada en estado 
        <span class="pending">pendiente</span>.  
        Un administrador revisará la información y recibirás un correo 📩
      </p>

      <!-- Contador -->
      <p class="success-counter">
        Serás redirigido al inicio en <strong>{{ counter }}</strong> segundos...
      </p>

      <!-- Botón -->
      <button class="success-button" @click="goHome">
        Ir al Login ahora
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const type = route.query.type || 'client'
const counter = ref(5)
let interval: any

const goHome = () => {
  router.push({ name: 'Login' })
}

onMounted(() => {
  interval = setInterval(() => {
    if (counter.value > 1) {
      counter.value--
    } else {
      goHome()
    }
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>
/* ===== Register Success (moderno con glassmorphism y animaciones) ===== */

/* Contenedor */
.success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: linear-gradient(135deg, #4a4a55 0%, #1c1b1f 50%, #463e42 100%);
  position: relative;
  overflow: hidden;
}

/* Tarjeta principal */
.success-card {
  width: 100%;
  max-width: 640px;
  padding: 40px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.20),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  text-align: center;
  animation: fade-up 0.7s ease-out both;
}

/* Icono circular */
.success-icon {
  width: 96px;
  height: 96px;
  margin: 0 auto 22px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  animation: pop 0.5s ease-out 0.15s both;
}

.success-icon svg {
  width: 48px;
  height: 48px;
  color: #34d399;
  stroke: currentColor;
  fill: none;
  stroke-width: 3;
}

/* Título */
.success-title {
  font-size: 34px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.25);
  margin-bottom: 16px;
}

/* Texto */
.success-text {
  font-size: 17px;
  line-height: 1.6;
  color: rgba(255,255,255,0.92);
  margin: 0 auto 20px;
  max-width: 520px;
}

.success-text .pending {
  color: #fde047;
  font-weight: 700;
}

/* Contador */
.success-counter {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 26px;
}

.success-counter strong {
  color: #fff;
}

/* Botón */
.success-button {
  padding: 12px 28px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #dcdcdd 0%, #817e7f 100%);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.success-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(99, 102, 241, 0.45);
  filter: brightness(1.05);
}

.success-button:active {
  transform: translateY(0);
}

/* Animaciones */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pop {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Responsive */
@media (max-width: 480px) {
  .success-card {
    padding: 28px 22px;
    border-radius: 22px;
  }
  .success-title {
    font-size: 26px;
  }
  .success-text {
    font-size: 15px;
  }
  .success-icon {
    width: 84px;
    height: 84px;
  }
  .success-icon svg {
    width: 42px;
    height: 42px;
  }
}
</style>
