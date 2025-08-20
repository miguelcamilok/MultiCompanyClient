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
                    <button class="login-btn" @click="onLogin">👤 Log in</button>
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
                    <router-link 
                        :to="item.href" 
                        class="nav-link" 
                        :class="{ active: isActiveRoute(item.href) }">
                        {{ item.label }}
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

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
        const searchQuery = ref('');
        const route = useRoute();

        const onSearch = () => {
            emit('search', searchQuery.value);
        };

        const onLogin = () => {
            emit('login');
        };

        const isActiveRoute = (href: string) => {
            return route.path === href;
        };

        return {
            searchQuery,
            onSearch,
            onLogin,
            isActiveRoute
        };
    }
});
</script>

<style scoped>
@import "../assets/css/styles.css";

.nav-link {
    position: relative;
    padding-bottom: 5px;
    text-decoration: none;
    color: #333;
    transition: color 0.3s;
}

.nav-link:hover {
    color: #000;
}

/* Línea inferior para activo */
.nav-link.active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3px; /* grosor de la línea */
    background: linear-gradient(135deg, #7c3aed, #a855f7); /* color de la línea */
    border-radius: 2px;
}

</style>
