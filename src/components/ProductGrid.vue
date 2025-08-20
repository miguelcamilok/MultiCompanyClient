<template>
  <div class="products-grid">
    <article v-for="product in products" :key="product.id" class="product-card" @click="$emit('select', product)">
      <div class="product-image-container">
        <img :src="product.media" :alt="product.name" class="product-image" loading="lazy"
          @error="$emit('img-error', $event)">
        <div v-if="product.offer" class="offer-badge">{{ product.offer }}</div>
        <div v-if="product.free_shipping" class="shipping-badge">Envío gratis</div>
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <div class="product-pricing">
          <div v-if="product.original_price && product.discount" class="pricing-with-discount">
            <span class="original-price">${{ formatPrice(product.original_price) }}</span>
            <div class="current-pricing">
              <span class="current-price">${{ formatPrice(product.unit_price) }}</span>
              <span class="discount-badge">{{ product.discount }}% OFF</span>
            </div>
          </div>
          <div v-else class="pricing-simple">
            <span class="current-price">${{ formatPrice(product.unit_price) }}</span>
          </div>
        </div>
        <!-- Información adicional -->
        <div class="product-features">
          <div v-if="product.installments" class="feature">
            {{ product.installments }}x sin interés
          </div>
          <div v-if="product.international" class="feature international">
            🌎 Internacional
          </div>
        </div>

        <!-- Rating mejorado -->
        <div class="product-rating">
          <div class="rating-stars">
            <span v-for="i in 5" :key="i" class="star" :class="{
              'star-filled': i <= Math.floor(product.rating),
              'star-half': i === Math.ceil(product.rating) && product.rating % 1 !== 0
            }">
              ★
            </span>
          </div>
          <span class="rating-text">{{ product.rating }} {{ product.ratingCount }}</span>
        </div>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'ProductGrid',
  props: {
    products: {
      type: Array as PropType<any[]>,
      required: true
    },
    formatPrice: {
      type: Function as PropType<(price: number) => string>,
      required: true
    }
  }
});
</script>
<style scoped>
@import "../assets/css/products.css";
</style>