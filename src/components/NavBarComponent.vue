<template>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">{{ companyName }}</div>

                <div class="search-container">
                    <input v-model="searchQuery" type="text" class="search-bar" :placeholder="searchPlaceholder">
                    <button class="search-btn" @click="onSearch">🔎</button>
                </div>

                <div class="header-actions">
                    <!-- Si no está logueado -->
                    <!-- Si no está logueado -->
                    <button v-if="!isLoggedIn" @click="goLogin" class="login-btn" type="button">
                        Iniciar Sesión
                    </button>


                    <!-- Si está logueado -->
                    <div v-else class="user-menu" @click="toggleDropdown">
                        <div class="user-info">
                            Hola, {{ firstName }}
                            <span class="user-arrow">▾</span>
                        </div>

                        <div v-if="dropdownOpen" class="dropdown">
                            <ul>
                                <li @click="goProfile">Perfil</li>
                                <li @click="logout">Cerrar Sesión</li>
                            </ul>
                        </div>
                    </div>

                    <button class="cart-btn">
                        🛒
                        <span class="cart-count">{{ cartCount }}</span>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <nav class="nav">
        <div class="container">
            <ul class="nav-list">
                <li v-for="(item, index) in navLinks" :key="index" class="nav-item">
                    <router-link :to="item.href" class="nav-link" :class="{ active: isActiveRoute(item.href) }">
                        {{ item.label }}
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
    <div v-if="showLoading" class="overlay">
        <div class="spinner"></div>
    </div>

</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' // tu Pinia/Vuex store

export default defineComponent({
    name: 'HeaderNav',
    props: {
        companyName: {
            type: String,
            default: 'MultiCompany'
        },
        navLinks: {
            type: Array as () => Array<{ label: string; href: string }>,
            default: () => [
                { label: 'Shop All', href: '/' },
                { label: 'Computers', href: '/computers' },
                { label: 'Tablets', href: '/tablets' },
                { label: 'Drones & Cameras', href: '/drones-cameras' },
                { label: 'Audio', href: '/audio' },
                { label: 'Mobile', href: '/mobile' },
                { label: 'TV & Home Cinema', href: '/tv-home-cinema' },
            ]
        },
        searchPlaceholder: {
            type: String,
            default: 'Search for products...'
        },
        cartCount: {
            type: Number,
            default: 0
        }
    },
    setup(props, { emit }) {
        const searchQuery = ref('')
        const route = useRoute()
        const router = useRouter()
        const auth = useAuthStore()

        const dropdownOpen = ref(false)
        const showLoading = ref(false)

        const isLoggedIn = computed(() => !!auth.user)
        const firstName = computed(() => auth.user?.name?.split(' ')[0] || '')

        const onSearch = () => {
            emit('search', searchQuery.value)
        }

        const goLogin = () => {
            showLoading.value = true
            setTimeout(() => {
                window.location.href = '/login'
            }, 200) // le damos 200ms para que alcance a mostrar el loader
        }


        const toggleDropdown = () => {
            dropdownOpen.value = !dropdownOpen.value
        }

        const goProfile = () => {
            router.push({ name: 'profile' })
        }

        const logout = () => {
            auth.logout()
            router.push({ name: 'home' })
        }

        const isActiveRoute = (href: string) => {
            return route.path === href
        }
        return {
            searchQuery,
            onSearch,
            goLogin,
            isActiveRoute,
            isLoggedIn,
            firstName,
            dropdownOpen,
            toggleDropdown,
            goProfile,
            logout,
            showLoading
        }
    }
})

</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.spinner {
    border: 4px solid #eee;
    border-top: 4px solid #7c3aed;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}

/* Dropdown */
.user-menu {
    position: relative;
    cursor: pointer;
}

.user-info {
    display: flex;
    align-items: center;
    font-weight: 500;
    color: #333;
}

.user-arrow {
    margin-left: 5px;
    font-size: 12px;
}

.dropdown {
    position: absolute;
    right: 0;
    top: 120%;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    min-width: 150px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
}

.dropdown ul {
    list-style: none;
    padding: 8px 0;
    margin: 0;
}

.dropdown li {
    padding: 10px 15px;
    cursor: pointer;
    transition: background 0.2s;
}

.dropdown li:hover {
    background: #f5f5f5;
}
</style>
