<!-- HeaderNav.vue -->
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
                    <a :href="item.href" class="nav-link">{{ item.label }}</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

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
                { label: 'Shop All', href: '#' },
                { label: 'Computers', href: '#' },
                { label: 'Tablets', href: '#' },
                { label: 'Drones & Cameras', href: '#' },
                { label: 'Audio', href: '#' },
                { label: 'Mobile', href: '#' },
                { label: 'TV & Home Cinema', href: '#' },
                { label: 'Wearable Tech', href: '#' },
                { label: 'Sale', href: '#' }
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

        const onSearch = () => {
            emit('search', searchQuery.value);
        };

        const onLogin = () => {
            emit('login');
        };

        return {
            searchQuery,
            onSearch,
            onLogin
        };
    }
});
</script>

<style scoped>
@import "../assets/css/styles.css";
</style>

