import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth'
import './assets/css/styles.css'; // Import global styles

const app = createApp(App);

// 1️⃣ Crear Pinia
const pinia = createPinia()
app.use(pinia)

// 2️⃣ Usar router
app.use(router)

// 3️⃣ Obtener store correctamente con Pinia activa
const authStore = useAuthStore(pinia)
if (authStore.token) {
    authStore.fetchUser()
}

// 4️⃣ Montar la app
app.mount('#app');
