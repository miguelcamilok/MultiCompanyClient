<template>
  <div class="computers-page">
    <HeaderNav />
    <main class="main">
      <!-- Breadcrumbs Navigation -->
      <nav class="breadcrumbs">
        <div class="container">
          <ol class="breadcrumb-list">
            <li><a href="/" class="breadcrumb-link">Inicio</a></li>
            <li><span class="breadcrumb-separator">></span></li>
            <li><a href="/computers" class="breadcrumb-link">Computación</a></li>
            <li v-if="selectedCategory" class="breadcrumb-current">
              <span class="breadcrumb-separator">></span>
              <span>{{ getCategoryPath(selectedCategory) }}</span>
            </li>
          </ol>
        </div>
      </nav>

      <!-- Active Filters Bar -->
      <div v-if="hasActiveFilters" class="active-filters">
        <div class="container">
          <h4 class="active-filters-title">Filtros activos:</h4>
          <div class="active-filters-list">
            <div v-if="selectedCategory" class="filter-tag">
              <span>{{ selectedCategory }}</span>
              <button @click="clearCategory" class="filter-remove">×</button>
            </div>
            <div v-if="selectedPrice" class="filter-tag">
              <span>{{ selectedPrice }}</span>
              <button @click="clearPrice" class="filter-remove">×</button>
            </div>
            <div v-if="selectedBrand" class="filter-tag">
              <span>{{ selectedBrand }}</span>
              <button @click="clearBrand" class="filter-remove">×</button>
            </div>
            <button @click="clearAllFilters" class="clear-all-filters">
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- Filtros sidebar -->
        <aside class="filters-sidebar">
          <div class="filters-container">
            <h3 class="filters-main-title">Filtros</h3>

            <div class="filter-group">
              <h4 class="filter-title">Categorías</h4>
              <div class="filter-options">
                <label v-for="cat in categories" :key="cat" class="filter-option">
                  <input type="radio" :value="cat" v-model="selectedCategory" @change="applyFilters"
                    class="filter-radio">
                  <span class="filter-label">{{ cat }}</span>
                </label>
              </div>
            </div>

            <div class="filter-group">
              <h4 class="filter-title">Precio</h4>
              <div class="filter-options">
                <label v-for="price in priceFilters" :key="price" class="filter-option">
                  <input type="radio" :value="price" v-model="selectedPrice" @change="applyFilters"
                    class="filter-radio">
                  <span class="filter-label">{{ price }}</span>
                </label>
              </div>
            </div>

            <div class="filter-group">
              <h4 class="filter-title">Marca</h4>
              <div class="filter-options">
                <label v-for="brand in brands" :key="brand" class="filter-option">
                  <input type="radio" :value="brand" v-model="selectedBrand" @change="applyFilters"
                    class="filter-radio">
                  <span class="filter-label">{{ brand }}</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Productos -->
        <section class="products-section">
          <div class="products-header">
            <h2 class="products-title">{{ products.length }} productos encontrados</h2>
            <div class="sort-controls">
              <label for="sort-select" class="sort-label">Ordenar por:</label>
              <select id="sort-select" v-model="sortOrder" @change="applyFilters" class="sort-select">
                <option value="relevant">Más relevantes</option>
                <option value="price_asc">Precio: bajo a alto</option>
                <option value="price_desc">Precio: alto a bajo</option>
                <option value="newest">Nuevo primero</option>
                <option value="rating">Mejor calificados</option>
              </select>
            </div>
          </div>

          <div class="products-grid">
            <article v-for="product in products" :key="product.id" class="product-card" @click="goToProduct(product)"
              style="cursor: pointer;">
              <div class="product-image-container">
                <img :src="product.media" :alt="product.name" class="product-image" @error="onImgError" loading="lazy">
                <div v-if="product.offer" class="offer-badge">{{ product.offer }}</div>
                <div v-if="product.free_shipping" class="shipping-badge">Envío gratis</div>
              </div>

              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>



                <!-- Precio optimizado -->
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

          <div id="scroll-anchor"></div>
        </section>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import HeaderNav from '../../components/NavBarComponent.vue';
import FooterComponent from '../../components/FooterComponent.vue';
import api from '../../services/api';
import { useRouter } from 'vue-router'

const DEFAULT_PROPERTY_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNmM3NTdkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+";

export default defineComponent({
  name: 'ComputersView',
  components: { HeaderNav, FooterComponent },
  setup() {
    const router = useRouter()
    // State
    const products = ref<any[]>([]);
    const categories = ['Laptops', 'Desktops', 'Accesorios', 'Periféricos', 'Componentes'];
    const priceFilters = ['Menos de $50.000', '$50.000 - $100.000', '$100.000 - $200.000', 'Más de $200.000'];
    const brands = ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Microsoft', 'Logitech'];

    const selectedCategory = ref('');
    const selectedPrice = ref('');
    const selectedBrand = ref('');
    const sortOrder = ref('relevant');
    const nextPage = ref(1);
    const isLoading = ref(false);

    const goToProduct = (product: any) => {
      // Guardar datos del producto en sessionStorage para pasarlos a BuyView
      sessionStorage.setItem('selectedProduct', JSON.stringify(product))

      // Navegar a la vista de compra
      router.push(`/product/${product.id}`)
    }

    // Mapeo categorías ES -> EN
    const categoriesMap: Record<string, string> = {
      'Laptops': 'laptops',
      'Desktops': 'desktops',
      'Accesorios': 'accessories',
      'Periféricos': 'peripherals',
      'Componentes': 'components'
    };

    // Computed
    const hasActiveFilters = computed(() => {
      return selectedCategory.value || selectedPrice.value || selectedBrand.value;
    });

    // Methods
    const formatPrice = (price: number | string): string => {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      return numPrice.toLocaleString('es-CO');
    };

    const getCategoryPath = (category: string): string => {
      const paths: Record<string, string> = {
        'Laptops': 'Laptops y Portátiles',
        'Desktops': 'Computadoras de Escritorio',
        'Accesorios': 'Accesorios',
        'Periféricos': 'Periféricos de PC',
        'Componentes': 'Componentes de PC'
      };
      return paths[category] || category;
    };

    const fetchProducts = async (): Promise<void> => {
      if (isLoading.value) return;
      isLoading.value = true;

      try {
        const params: any = { page: nextPage.value };

        // Mapeo al valor que espera backend
        if (selectedCategory.value) {
          params.category = categoriesMap[selectedCategory.value];
        }
        if (selectedPrice.value) params.price = selectedPrice.value;
        if (selectedBrand.value) params.brand = selectedBrand.value;
        if (sortOrder.value) params.sort = sortOrder.value;

        const response = await api.get('/products', { params });

        if (nextPage.value === 1) {
          products.value = response.data.data || [];
        } else {
          products.value.push(...(response.data.data || []));
        }

        nextPage.value = response.data.next_page || null;
      } catch (error) {
        console.error('Error fetching products:', error);
        products.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const applyFilters = (): void => {
      nextPage.value = 1;
      fetchProducts();
    };

    const clearCategory = (): void => {
      selectedCategory.value = '';
      applyFilters();
    };

    const clearPrice = (): void => {
      selectedPrice.value = '';
      applyFilters();
    };

    const clearBrand = (): void => {
      selectedBrand.value = '';
      applyFilters();
    };

    const clearAllFilters = (): void => {
      selectedCategory.value = '';
      selectedPrice.value = '';
      selectedBrand.value = '';
      applyFilters();
    };

    const onImgError = (event: Event): void => {
      const img = event.target as HTMLImageElement;
      if (img.src !== DEFAULT_PROPERTY_IMAGE) {
        img.src = DEFAULT_PROPERTY_IMAGE;
        img.onerror = null;
      }
    };

    const loadMore = async (): Promise<void> => {
      if (!nextPage.value || isLoading.value) return;
      await fetchProducts();
    };

    onMounted(() => {
      fetchProducts();

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { rootMargin: '200px' }
      );

      const anchor = document.querySelector('#scroll-anchor');
      if (anchor) observer.observe(anchor);
    });

    return {
      products,
      categories,
      priceFilters,
      brands,
      selectedCategory,
      selectedPrice,
      selectedBrand,
      sortOrder,
      isLoading,
      hasActiveFilters,
      formatPrice,
      getCategoryPath,
      applyFilters,
      clearCategory,
      clearPrice,
      clearBrand,
      clearAllFilters,
      onImgError,
      goToProduct
    };
  }
});
</script>


<style scoped>
@import "../../assets/css/products.css";
</style>