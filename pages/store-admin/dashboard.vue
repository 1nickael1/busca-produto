<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard da Loja</h1>
    
    <!-- Informações da Loja -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Minha Loja</h2>
      </template>
      
      <div v-if="store" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ store.name }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ store.description }}</p>
            <p class="text-sm text-gray-500">{{ store.address }}</p>
            <p class="text-sm text-gray-500">{{ store.city }}, {{ store.state }}</p>
          </div>
          
          <div class="text-right">
            <p class="text-2xl font-bold text-green-600">{{ store.products_count }} produtos</p>
            <p class="text-sm text-gray-500">Avaliação: {{ store.rating }}/5</p>
          </div>
        </div>
        
        <div class="flex space-x-4">
          <UButton
            @click="showEditStoreModal = true"
            color="blue"
            size="sm"
          >
            Editar Loja
          </UButton>
        </div>
      </div>
    </UCard>
    
    <!-- Produtos da Loja -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Produtos da Loja</h2>
          <UButton
            @click="showCreateProductModal = true"
            color="green"
            size="sm"
          >
            Novo Produto
          </UButton>
        </div>
      </template>
      
      <div v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="product in products"
          :key="product.id"
          class="hover:shadow-lg transition-shadow"
        >
          <div v-if="product.image_url" class="mb-4">
            <img
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-48 object-cover rounded-md"
            />
          </div>
          
          <template #header>
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ product.name }}</h3>
          </template>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ product.description }}</p>
          
          <div class="space-y-2">
            <p class="text-green-600 font-semibold text-lg">R$ {{ product.price }}</p>
            <p class="text-sm text-gray-500">Estoque: {{ product.stock }} unidades</p>
            <UBadge color="blue" variant="soft">{{ product.category }}</UBadge>
          </div>
          
          <template #footer>
            <div class="flex space-x-2">
              <UButton
                @click="editProduct(product)"
                variant="ghost"
                color="blue"
                size="sm"
              >
                Editar
              </UButton>
              <UButton
                @click="deleteProduct(product.id)"
                variant="ghost"
                color="red"
                size="sm"
              >
                Excluir
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
      
      <div v-else class="text-center py-8">
        <UAlert
          color="blue"
          variant="soft"
          icon="i-heroicons-information-circle"
        >
          Nenhum produto cadastrado ainda. Clique em "Novo Produto" para começar!
        </UAlert>
      </div>
    </UCard>
    
    <!-- Modal de edição da loja -->
    <div v-if="showEditStoreModal && store" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Loja</h3>
        
        <form @submit.prevent="updateStore" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              v-model="editingStore.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              v-model="editingStore.description"
              rows="3"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <input
              v-model="editingStore.address"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              v-model="editingStore.phone"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                v-model="editingStore.city"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                v-model="editingStore.state"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div class="flex space-x-4">
            <button
              type="button"
              @click="showEditStoreModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Atualizar
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal de criação de produto -->
    <div v-if="showCreateProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Novo Produto</h3>
        
        <form @submit.prevent="createProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              v-model="newProduct.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              v-model="newProduct.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Preço</label>
            <input
              v-model="newProduct.price"
              type="number"
              step="0.01"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <input
              v-model="newProduct.category"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
            <input
              v-model="newProduct.stock"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
            <input
              v-model="newProduct.image_url"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div class="flex space-x-4">
            <button
              type="button"
              @click="showCreateProductModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal de edição de produto -->
    <div v-if="showEditProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Produto</h3>
        
        <form @submit.prevent="updateProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              v-model="editingProduct.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              v-model="editingProduct.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Preço</label>
            <input
              v-model="editingProduct.price"
              type="number"
              step="0.01"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <input
              v-model="editingProduct.category"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
            <input
              v-model="editingProduct.stock"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
            <input
              v-model="editingProduct.image_url"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div class="flex space-x-4">
            <button
              type="button"
              @click="showEditProductModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Atualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['store-admin']
})

const authStore = useAuthStore()
const adminStore = useAdminStore()

const store = ref(null)
const products = ref([])
const showEditStoreModal = ref(false)
const showCreateProductModal = ref(false)
const showEditProductModal = ref(false)

const editingStore = ref({
  name: '',
  description: '',
  address: '',
  phone: '',
  city: '',
  state: ''
})

const newProduct = ref({
  name: '',
  description: '',
  price: null,
  category: '',
  stock: 0,
  image_url: '',
  store_id: null
})

const editingProduct = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  image_url: ''
})

// Carregar dados da loja
onMounted(async () => {
  console.log('=== ONMOUNTED ===')
  console.log('AuthStore user:', authStore.user)
  console.log('AuthStore user store_id:', authStore.user?.store_id)
  console.log('AuthStore isAuthenticated:', authStore.isAuthenticated)
  
  await loadStoreData()
  await loadProducts()
})

const loadStoreData = async () => {
  try {
    console.log('Carregando dados da loja:', authStore.user?.store_id)
    const response = await $fetch(`/api/admin/stores/${authStore.user?.store_id}`)
    console.log('Dados da loja carregados:', response)
    store.value = response.store
    editingStore.value = { ...response.store }
  } catch (error) {
    console.error('Erro ao carregar dados da loja:', error)
  }
}

const loadProducts = async () => {
  try {
    console.log('=== CARREGANDO PRODUTOS ===')
    console.log('User completo:', authStore.user)
    console.log('User store_id:', authStore.user?.store_id)
    console.log('User store_id type:', typeof authStore.user?.store_id)
    
    if (!authStore.user?.store_id) {
      console.error('ERRO: store_id não encontrado no usuário!')
      return
    }
    
    const response = await $fetch('/api/admin/products')
    console.log('Total de produtos carregados:', response.products.length)
    
    const userStoreId = parseInt(authStore.user?.store_id)
    console.log('User store_id convertido:', userStoreId)
    
    if (isNaN(userStoreId)) {
      console.error('ERRO: store_id é NaN!')
      return
    }
    
    const filteredProducts = response.products.filter(p => {
      const productStoreId = parseInt(p.store_id)
      const matches = productStoreId === userStoreId
      console.log(`Produto "${p.name}": store_id=${productStoreId}, user_store_id=${userStoreId}, matches=${matches}`)
      return matches
    })
    
    products.value = filteredProducts
    console.log('Produtos filtrados encontrados:', filteredProducts.length)
    console.log('Produtos filtrados:', filteredProducts)
    console.log('=== FIM CARREGAMENTO ===')
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
}

const updateStore = async () => {
  try {
    await adminStore.updateStore(store.value.id, editingStore.value)
    await loadStoreData()
    showEditStoreModal.value = false
  } catch (error) {
    console.error('Erro ao atualizar loja:', error)
  }
}

const createProduct = async () => {
  try {
    console.log('Dados do produto antes de enviar:', newProduct.value)
    newProduct.value.store_id = parseInt(authStore.user?.store_id)
    console.log('Dados do produto com store_id:', newProduct.value)
    const result = await adminStore.createProduct(newProduct.value)
    console.log('Resultado da criação:', result)
    if (result.success) {
      showCreateProductModal.value = false
      newProduct.value = { name: '', description: '', price: 0, category: '', stock: 0, image_url: '', store_id: null }
      await loadProducts()
    } else {
      console.error('Erro ao criar produto:', result.error)
    }
  } catch (error) {
    console.error('Erro na criação do produto:', error)
  }
}

const editProduct = (product) => {
  editingProduct.value = { ...product }
  showEditProductModal.value = true
}

const updateProduct = async () => {
  const result = await adminStore.updateProduct(editingProduct.value.id, editingProduct.value)
  if (result.success) {
    showEditProductModal.value = false
    editingProduct.value = { id: null, name: '', description: '', price: 0, category: '', stock: 0, image_url: '' }
    await loadProducts()
  }
}

const deleteProduct = async (id) => {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    const result = await adminStore.deleteProduct(id)
    if (result.success) {
      await loadProducts()
    }
  }
}
</script> 