<!-- Home.vue -->
<template>
  <div>
    <NavBarComponent />

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">Flash Prices</div>
            <h1 class="hero-title">
              Incredible Prices<br>
              on All Your<br>
              Favorite Items
            </h1>
            <p class="hero-subtitle">Get more for less on selected brands</p>
            <button class="hero-btn">Shop Now</button>
          </div>
          <div class="hero-image">
            <!-- Imagen del héroe aquí -->
          </div>
        </div>
      </div>
    </section>

    <!-- Promotional Banners -->
    <section class="promo-section">
      <div class="container">
        <div class="promo-grid">
          <div v-for="(promo, index) in promoCards" :key="index" :class="['promo-card', promo.color]">
            <h3 v-html="promo.title"></h3>
            <p>{{ promo.desc }}</p>
            <button class="promo-btn">Shop</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="container">
        <div class="features-grid">
          <div v-for="(feature, index) in features" :key="index" class="feature-item">
            <div class="feature-icon">{{ feature.icon }}</div>
            <div class="feature-title">{{ feature.title }}</div>
            <div class="feature-desc">{{ feature.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="bestsellers">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Best Sellers</h2>
        </div>

        <div class="product-grid">
          <div v-for="(product, index) in bestSellers" :key="index" class="product-card">
            <div v-if="product.badge" class="product-badge">{{ product.badge }}</div>
            <div class="product-image">{{ product.icon }}</div>
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">
              <span v-if="product.salePrice">{{ product.salePrice }} <s>{{ product.price }}</s></span>
              <span v-else>{{ product.price }}</span>
            </div>
            <div class="product-rating">
              <span class="stars">{{ product.stars }}</span>
              <span class="rating-count">({{ product.rating }})</span>
            </div>
          </div>
        </div>

        <button class="view-all-btn">View All</button>
      </div>
    </section>


    <!-- Categories -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Shop by Category</h2>
        </div>

        <div class="categories-grid">
          <div v-for="(cat, index) in topCategories" :key="index" class="category-card">
            <div class="category-icon">{{ cat.icon }}</div>
            <div class="category-name">{{ cat.name }}</div>
          </div>
        </div>

        <div class="bottom-categories">
          <div v-for="(cat, index) in bottomCategories" :key="index" class="category-card">
            <div class="category-icon">{{ cat.icon }}</div>
            <div class="category-name">{{ cat.name }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <FooterComponent />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import NavBarComponent from "../components/NavBarComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";

import api from '../services/api';

export default defineComponent({
  name: 'HomeView',
  components: {
    NavBarComponent,
    FooterComponent
  },
  setup() {
    // Datos estáticos
    const promoCards = [
      { title: 'Holiday Deals<br>Up to<br>30% off', desc: 'Selected Smartphone Brands', color: 'promo-red' },
      { title: 'Just In<br>Take Your<br>Sound<br>Anywhere', desc: 'Top Headphone Brands', color: 'promo-purple' }
    ];
    const features = [
      { icon: '🚚', title: 'Curb-side pickup', desc: 'Available' },
      { icon: '📦', title: 'Free shipping on orders over $50', desc: 'Fast delivery' },
      { icon: '💰', title: 'Low prices guaranteed', desc: 'Best deals' },
      { icon: '🕐', title: 'Available to you 24/7', desc: 'Customer support' }
    ];
    const topCategories = [
      { icon: '💻', name: 'Computers' },
      { icon: '📱', name: 'Mobile' },
      { icon: '📷', name: 'Drones & Cameras' },
      { icon: '🏷️', name: 'Sale' },
      { icon: '📟', name: 'Tablets' }
    ];
    const bottomCategories = [
      { icon: '🏆', name: 'Best Sellers' },
      { icon: '📺', name: 'TV\'s Home Cinema' },
      { icon: '⌚', name: 'Wearable Tech' },
      { icon: '🔊', name: 'Audio' },
      { icon: '🎧', name: 'Headphones' }
    ];

    // Best Sellers dinámicos
    const bestSellers = ref<any[]>([]);

    onMounted(async () => {
      // Buscar todas las hojas de estilo que provienen del login
      const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
        .filter(link => link.href.includes('login.css'))  // Filtra solo tu CSS de login

      // Removerlas del DOM
      links.forEach(link => link.remove())

      // Si hay <style> inline inyectado por login, también se puede limpiar
      const styles = Array.from(document.querySelectorAll<HTMLStyleElement>('style'))
        .filter(style => style.innerText.includes('.login-header'))  // o cualquier selector del login
      styles.forEach(style => style.remove())
      try {
        const { data } = await api.get('products/best-sellers');
        // Ajustamos datos si hace falta (por ejemplo, iconos, badges)
        bestSellers.value = data.map((p: any) => ({
          badge: p.is_best_seller ? 'Best Seller' : '',
          icon: '📦', // Puedes asignar según categoría o tipo
          name: p.name,
          price: `$${p.unit_price}`,
          salePrice: p.sale_price ? `$${p.sale_price}` : '',
          stars: '★★★★★', // Opcional, se puede calcular por rating
          rating: p.rating
        }));
      } catch (error) {
        console.error('Error loading best sellers:', error);
      }
    });

    return { promoCards, features, topCategories, bottomCategories, bestSellers };
  }
});
</script>


<style scoped>
@import "../assets/css/styles.css";
</style>
