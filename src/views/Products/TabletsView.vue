<template>
  <div class="tablets-page">
    <HeaderNav />

    <!-- Breadcrumbs -->
    <Breadcrumbs :crumbs="breadcrumbs" />

    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="active-filters">
      <div class="container">
        <h4 class="active-filters-title">Filtros activos:</h4>
        <div class="active-filters-list">
          <div
            v-for="key in Object.keys(filters) as Array<'category' | 'price' | 'brand' | 'free_shipping'>"
            v-if="filters[key] && key !== 'free_shipping'"
            :key="key"
            class="filter-tag"
          >
            <span>{{ filters[key] }}</span>
            <button @click="clearFilter(key)" class="filter-remove">×</button>
          </div>
          <div v-if="filters.free_shipping" class="filter-tag">
            <span>Envío gratuito</span>
            <button @click="clearFilter('free_shipping')" class="filter-remove">×</button>
          </div>
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="clear-all-filters"
          >
            Limpiar todos los filtros
          </button>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Filtros sidebar -->
      <FiltersSidebar
        :filterGroups="filterGroups"
        v-model="filters"
        @update="applyFilters"
      />

      <!-- Productos -->
      <section class="products-section">
        <div class="products-header">
          <h2 class="products-title">{{ products.length }} productos encontrados</h2>
          <div class="sort-controls">
            <label for="sort-select" class="sort-label">Ordenar por:</label>
            <select
              id="sort-select"
              v-model="sortOrder"
              @change="applyFilters"
              class="sort-select"
            >
              <option value="relevant">Más relevantes</option>
              <option value="price_asc">Precio: bajo a alto</option>
              <option value="price_desc">Precio: alto a bajo</option>
              <option value="newest">Nuevo primero</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </div>
        </div>

        <ProductGrid
          :products="products"
          :formatPrice="formatPrice"
          @select="goToProduct"
          @img-error="onImgError"
        />

        <div v-if="isLoading" class="loading-indicator" style="text-align: center; padding: 20px;">
          Cargando productos...
        </div>

        <div v-if="products.length === 0 && !isLoading" class="no-products" style="text-align: center; padding: 40px;">
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar tus filtros de búsqueda</p>
        </div>

        <div id="scroll-anchor"></div>
      </section>
    </div>

    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import HeaderNav from '../../components/NavBarComponent.vue';
import FooterComponent from '../../components/FooterComponent.vue';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import FiltersSidebar from '../../components/FiltersSidebar.vue';
import ProductGrid from '../../components/ProductGrid.vue';
import api from '../../services/api';

const DEFAULT_PROPERTY_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNmM3NTdkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+";

export default defineComponent({
  name: 'TabletsView',
  components: { HeaderNav, FooterComponent, Breadcrumbs, FiltersSidebar, ProductGrid },
  setup() {
    const router = useRouter();
    const products = ref<any[]>([]);
    const sortOrder = ref('relevant');
    const nextPage = ref(1);
    const isLoading = ref(false);

    const validCategories = [
      'iPad',
      'Android Tablets',
      'Windows Tablets',
      'Accesorios Tablets'
    ];

    const categoriesMap: Record<string, string> = {
      'iPad': 'ipad',
      'Android Tablets': 'android_tablets',
      'Windows Tablets': 'windows_tablets',
      'Accesorios Tablets': 'tablet_accessories'
    };

    const filters = ref<{ category: string | boolean; price: string | boolean; brand: string | boolean; free_shipping: string | boolean }>({
      category: '',
      price: '',
      brand: '',
      free_shipping: false
    });

    const filterGroups = [
      { title: 'Categorías', key: 'category', options: validCategories },
      { title: 'Precio', key: 'price', options: ['Menos de $500.000', '$500.000 - $1.000.000', '$1.000.000 - $2.000.000', 'Más de $2.000.000'] },
      { title: 'Marca', key: 'brand', options: ['Apple', 'Samsung', 'Lenovo', 'Microsoft', 'Huawei', 'Asus', 'Xiaomi', 'Honor'] },
      { title: 'Envío gratuito', key: 'free_shipping', options: [true] }
    ];

    const breadcrumbs = computed(() => {
      const crumbs = [
        { text: 'Inicio', link: '/' },
        { text: 'Tablets', link: '/tablets' }
      ];
      if (filters.value.category && validCategories.includes(filters.value.category)) {
        crumbs.push({ text: filters.value.category, link: `/tablets?category=${encodeURIComponent(filters.value.category)}` });
      }
      return crumbs;
    });

    const hasActiveFilters = computed(() => Object.values(filters.value).some(v => v));

    const formatPrice = (price: number | string) => {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      return numPrice.toLocaleString('es-CO');
    };

    const fetchProducts = async () => {
      if (isLoading.value) return;
      
      isLoading.value = true;

      try {
        const params: any = { 
          page: nextPage.value, 
          sort: sortOrder.value 
        };

        if (filters.value.category && validCategories.includes(filters.value.category)) {
          params.category = categoriesMap[filters.value.category];
        } else {
          params.category = 'ipad,android_tablets,windows_tablets,tablet_accessories';
        }

        if (filters.value.price) {
          params.price = filters.value.price;
        }
        if (filters.value.brand) {
          params.brand = filters.value.brand;
        }
        if (filters.value.free_shipping) {
          params.free_shipping = true;
        }

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

    const applyFilters = () => { 
      nextPage.value = 1; 
      fetchProducts(); 
    };

    const clearFilter = (key: string) => { 
      filters.value[key as keyof typeof filters.value] = key === 'free_shipping' ? false : ''; 
      applyFilters(); 
    };

    const clearAllFilters = () => { 
      Object.keys(filters.value).forEach(k => 
        filters.value[k as keyof typeof filters.value] = k === 'free_shipping' ? false : ''
      ); 
      applyFilters(); 
    };

    const onImgError = (event: Event) => { 
      const img = event.target as HTMLImageElement; 
      if (img.src !== DEFAULT_PROPERTY_IMAGE) { 
        img.src = DEFAULT_PROPERTY_IMAGE; 
        img.onerror = null; 
      } 
    };

    const goToProduct = (product: any) => { 
      sessionStorage.setItem('selectedProduct', JSON.stringify(product)); 
      router.push(`/product/${product.id}`); 
    };

    const loadMore = async () => { 
      if (!nextPage.value || isLoading.value) return;
      await fetchProducts(); 
    };

    onMounted(() => {
      fetchProducts();
      
      const observer = new IntersectionObserver(entries => { 
        if (entries[0].isIntersecting) {
          loadMore(); 
        }
      }, { rootMargin: '200px' });
      
      const anchor = document.querySelector('#scroll-anchor'); 
      if (anchor) {
        observer.observe(anchor);
      }
    });

    return { 
      products, 
      filters, 
      filterGroups, 
      sortOrder, 
      hasActiveFilters, 
      formatPrice, 
      breadcrumbs, 
      applyFilters, 
      clearFilter, 
      clearAllFilters, 
      onImgError, 
      goToProduct,
      isLoading
    };
  }
});
</script>

<style scoped>
@import "../../assets/css/products.css";

.loading-indicator {
  color: #6c757d;
  font-style: italic;
}

.no-products {
  color: #6c757d;
}
</style>