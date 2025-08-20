<template>
  <NavBarComponent />

  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-6" v-if="product">

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Galería de imágenes -->
        <div class="lg:col-span-2">
          <div class="flex gap-4">
            <!-- Thumbnails -->
            <div class="flex flex-col gap-2">
              <div v-for="(image, index) in productImages" :key="index"
                class="w-16 h-16 border-2 rounded-lg cursor-pointer overflow-hidden"
                :class="selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'"
                @click="selectedImageIndex = index">
                <img :src="image" :alt="product?.name || 'Producto'" class="w-full h-full object-cover">
              </div>
            </div>

            <!-- Imagen principal -->
            <div class="flex-1 bg-white rounded-xl shadow-sm p-8">
              <img :src="productImages[selectedImageIndex]" :alt="product?.name || 'Producto'"
                class="w-full h-96 object-contain">
            </div>
          </div>

          <!-- Productos relacionados debajo de las imágenes -->
          <div v-if="relatedProducts.length" class="mt-8">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Productos relacionados</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id"
                class="bg-white rounded-lg shadow-sm p-2 cursor-pointer hover:shadow-md flex items-start gap-4"
                @click="viewProduct(relatedProduct)">

                <!-- Imagen -->
                <img :src="relatedProduct.image || DEFAULT_PRODUCT_IMAGE" :alt="relatedProduct.name || 'Producto'"
                  class="w-16 h-16 border-2 rounded-lg border-blue-500 object-cover">

                <!-- Texto -->
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900 line-clamp-2">
                    {{ relatedProduct.name || 'Producto' }}
                  </h3>

                  <div class="flex items-center gap-2 text-xs mt-1">
                    <span class="text-gray-500 line-through">
                      ${{ (relatedProduct.originalPrice || 0).toLocaleString() }}
                    </span>
                    <span class="text-green-600 font-medium">
                      {{ relatedProduct.discount || 0 }}% OFF
                    </span>
                  </div>

                  <div class="text-sm font-bold text-gray-900 mt-1">
                    ${{ (relatedProduct.price || 0).toLocaleString() }}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Información del producto -->
        <div class="space-y-6">

          <!-- Badge y título -->
          <div>
            <span v-if="product.is_best_seller"
              class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full">
              BEST SELLER
            </span>

            <h1 class="text-2xl font-bold text-gray-900 mt-3">{{ product?.name || 'Producto' }}</h1>

            <!-- Rating -->
            <div class="flex items-center gap-2 mt-2">
              <div class="flex text-yellow-400">
                <svg v-for="n in 5" :key="n" class="w-4 h-4 fill-current">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="text-sm text-gray-600">({{ product?.reviews || 0 }})</span>
            </div>
          </div>

          <!-- Precio -->
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-500 line-through">
                ${{ product?.originalPrice?.toLocaleString() || 0 }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-3xl font-bold text-green-600">
                ${{ product?.price?.toLocaleString() || 0 }}
              </span>
              <span v-if="product?.discount || (product?.originalPrice && product?.price)"
                class="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                {{ product.discount ?? Math.round(((product.originalPrice - product.price) / product.originalPrice) *
                  100) }}% OFF
              </span>
            </div>
            <p class="text-sm text-gray-600">
              12 cuotas de ${{ Math.round((product?.price || 0) / 12).toLocaleString() }} con 0% interés
            </p>
          </div>

          <!-- Stock, envío, botones y garantías -->
          <div class="mt-4 space-y-3">

            <!-- Stock -->
            <div class="flex items-center" :class="product.total_stock > 0 ? 'text-green-600' : 'text-red-600'">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
              {{ product.total_stock > 0 ? `Stock disponible: ${product.total_stock}` : 'Agotado' }}
            </div>

            <!-- Envío -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center text-green-700 mb-1">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path
                    d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
                <span class="font-medium">
                  {{ product.freeShipping ? 'Envío gratis' : `Envío: $${product.shippingPrice?.toLocaleString() || 0}`
                  }}
                </span>
              </div>
              <p class="text-sm">a todo el país</p>
              <p class="text-xs text-gray-600">Conoce los tiempos y formas de envío</p>
            </div>

            <!-- Botones de acción -->
            <div class="space-y-3 mt-2">
              <button
                class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                :disabled="product.total_stock <= 0" @click="buyNow">
                Comprar ahora
              </button>

              <button
                class="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                :disabled="product.total_stock <= 0" @click="addToCart">
                Agregar al carrito
              </button>
            </div>

            <!-- Garantías -->
            <div class="space-y-3 pt-4 border-t">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Devolución gratis. Tienes 30 días desde que lo recibes
              </div>

              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Compra Protegida. Recibes el producto que esperas
              </div>
            </div>
          </div>

          <!-- Características del producto -->
          <div class="mt-6 bg-white p-4 rounded-lg shadow-sm space-y-4">
            <h2 class="text-lg font-bold text-gray-900 border-b pb-2">Características del producto</h2>

            <!-- Características principales -->
            <div class="space-y-1">
              <p><span class="font-medium">Marca:</span> {{ product.brand || 'N/A' }}</p>
              <p><span class="font-medium">Modelo:</span> {{ product.model || 'N/A' }}</p>
              <p><span class="font-medium">Color:</span> {{ product.color || 'N/A' }}</p>
              <p><span class="font-medium">Tamaño / Dimensiones:</span> {{ product.size || product.dimensions || 'N/A'
              }}</p>
              <p><span class="font-medium">Peso:</span> {{ product.weight || 'N/A' }}</p>
              <p><span class="font-medium">Material / Composición:</span> {{ product.material || 'N/A' }}</p>
            </div>

            <!-- Otras especificaciones -->
            <div class="space-y-1 mt-4">
              <h3 class="font-semibold">Otras especificaciones</h3>
              <p><span class="font-medium">Características adicionales:</span> {{ product.features?.join(', ') || 'N/A'
              }}</p>
              <p><span class="font-medium">Garantía:</span> {{ product.warranty || 'N/A' }}</p>
              <p><span class="font-medium">Envasado / Embalaje:</span> {{ product.packaging || 'N/A' }}</p>
              <p><span class="font-medium">Notas adicionales:</span> {{ product.notes || 'N/A' }}</p>
            </div>
          </div>

          <!-- Opciones del producto -->
          <div class="space-y-4">
            <!-- Color -->
            <div v-if="product?.colors?.length">
              <label class="block text-sm font-medium text-gray-900 mb-2">
                Color: {{ selectedOptions.color }}
              </label>
              <div class="flex gap-2">
                <button v-for="color in product.colors" :key="color.name" class="w-10 h-10 rounded-lg border-2"
                  :class="selectedOptions.color === color.name ? 'border-blue-500' : 'border-gray-200'"
                  :style="{ backgroundColor: color.value }" @click="selectedOptions.color = color.name"></button>
              </div>
            </div>

            <!-- Tamaño -->
            <div v-if="product?.sizes?.length">
              <label class="block text-sm font-medium text-gray-900 mb-2">
                Tamaño: {{ selectedOptions.size }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button v-for="size in product.sizes" :key="size" class="px-4 py-2 text-sm border rounded-lg"
                  :class="selectedOptions.size === size ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'"
                  @click="selectedOptions.size = size">
                  {{ size }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10">
      Cargando producto...
    </div>

    <FooterComponent />
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import FooterComponent from '../../components/FooterComponent.vue';
import NavBarComponent from '../../components/NavBarComponent.vue';
import api from '../../services/api';

const DEFAULT_PRODUCT_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNmM3NTdkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+";

export default defineComponent({
  name: 'BuyView',
  components: { NavBarComponent, FooterComponent },

  props: { productId: { type: String, required: true } },
  setup(props) {
    const selectedImageIndex = ref(0)
    const selectedOptions = reactive({ color: '', size: '' })
    const product = ref<any>(null)
    const relatedProducts = ref<any[]>([])


    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${props.productId}`)
        product.value = response.data

        selectedOptions.color = product.value.colors?.[0]?.name || ''
        selectedOptions.size = product.value.sizes?.[0] || ''

        if (product.value.category) {
          const related = await api.get('/products', {
            params: { category: product.value.category, limit: 4 }
          })
          relatedProducts.value = related.data.data.filter((p: any) => p.id !== props.productId)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    const productImages = computed(() => {
      if (!product.value || !product.value.media) return [DEFAULT_PRODUCT_IMAGE]

      let mediaArray: string[] = []

      try {
        // Intentamos parsear como JSON
        const parsed = JSON.parse(product.value.media)
        mediaArray = Array.isArray(parsed) ? parsed : [parsed]
      } catch (e) {
        // Si no es JSON, asumimos que es un string simple (URL)
        if (typeof product.value.media === 'string' && product.value.media.length) {
          mediaArray = [product.value.media]
        } else {
          mediaArray = []
        }
      }

      if (!mediaArray.length) return [DEFAULT_PRODUCT_IMAGE]

      return mediaArray.map(img => img || DEFAULT_PRODUCT_IMAGE)
    })



    const buyNow = () => alert('¡Redirigiendo al checkout!')
    const addToCart = () => alert('¡Producto agregado al carrito!')
    const viewProduct = (p: any) => window.location.href = `/product/${p.id}`

    onMounted(fetchProduct)

    return { product, relatedProducts, selectedImageIndex, selectedOptions, productImages, buyNow, addToCart, viewProduct, DEFAULT_PRODUCT_IMAGE }
  }
})
</script>

<style scoped>
@import "../../assets/css/productbuy.css";
</style>
