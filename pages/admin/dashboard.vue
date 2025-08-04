<template>
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard Administrativo</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Lojas</h3>
        <p class="text-3xl font-bold text-blue-600">{{ adminStore.stores.length }}</p>
        <p class="text-sm text-gray-600">Total de lojas cadastradas</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Produtos</h3>
        <p class="text-3xl font-bold text-green-600">{{ adminStore.products.length }}</p>
        <p class="text-sm text-gray-600">Total de produtos cadastrados</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Administradores</h3>
        <p class="text-3xl font-bold text-purple-600">{{ adminStore.admins.length }}</p>
        <p class="text-sm text-gray-600">Total de administradores</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Gerenciamento de Lojas -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Lojas</h2>
          <button
            @click="showCreateStoreModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Nova Loja
          </button>
        </div>
        
        <div v-if="adminStore.loading" class="text-center py-4">
          <p>Carregando...</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="store in adminStore.stores"
            :key="store.id"
            class="border rounded-lg p-4"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold">{{ store.name }}</h3>
                <p class="text-sm text-gray-600">{{ store.address }}</p>
                <p class="text-sm text-gray-600">{{ store.city }}, {{ store.state }}</p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editStore(store)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button
                  @click="deleteStore(store.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Gerenciamento de Produtos -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Produtos</h2>
          <button
            @click="showCreateProductModal = true"
            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Novo Produto
          </button>
        </div>
        
        <div v-if="adminStore.loading" class="text-center py-4">
          <p>Carregando...</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="product in adminStore.products"
            :key="product.id"
            class="border rounded-lg p-4"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold">{{ product.name }}</h3>
                <p class="text-sm text-gray-600">{{ product.description }}</p>
                <p class="text-sm text-gray-600">{{ product.category }}</p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editProduct(product)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button
                  @click="deleteProduct(product.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de criação de loja -->
    <div v-if="showCreateStoreModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Nova Loja</h3>
        
        <form @submit.prevent="createStore" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              v-model="newStore.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              v-model="newStore.description"
              rows="3"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Descreva a loja..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <input
              v-model="newStore.address"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              v-model="newStore.phone"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                v-model="newStore.city"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                v-model="newStore.state"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div class="flex space-x-4">
            <button
              type="button"
              @click="showCreateStoreModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Criar
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Loja</label>
            <select
              v-model="newProduct.store_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione uma loja</option>
              <option
                v-for="store in adminStore.stores"
                :key="store.id"
                :value="store.id"
              >
                {{ store.name }} - {{ store.city }}/{{ store.state }}
              </option>
            </select>
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
    
    <!-- Modal de edição de loja -->
    <div v-if="showEditStoreModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              placeholder="Descreva a loja..."
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Loja</label>
            <select
              v-model="editingProduct.store_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione uma loja</option>
              <option
                v-for="store in adminStore.stores"
                :key="store.id"
                :value="store.id"
              >
                {{ store.name }} - {{ store.city }}/{{ store.state }}
              </option>
            </select>
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
  middleware: ['admin']
})

const adminStore = useAdminStore()

const showCreateStoreModal = ref(false)
const showCreateProductModal = ref(false)
const showEditStoreModal = ref(false)
const showEditProductModal = ref(false)

const newStore = ref({
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
  price: 0,
  category: '',
  stock: 0,
  image_url: '',
  store_id: null
})

const editingStore = ref({
  id: null,
  name: '',
  description: '',
  address: '',
  phone: '',
  city: '',
  state: ''
})

const editingProduct = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  image_url: '',
  store_id: null
})

// Carregar dados iniciais
onMounted(async () => {
  await adminStore.fetchStores()
  await adminStore.fetchProducts()
})

const createStore = async () => {
  const result = await adminStore.createStore(newStore.value)
  if (result.success) {
    showCreateStoreModal.value = false
    newStore.value = { name: '', description: '', address: '', phone: '', city: '', state: '' }
  }
}

const createProduct = async () => {
  const result = await adminStore.createProduct(newProduct.value)
  if (result.success) {
    showCreateProductModal.value = false
    newProduct.value = { name: '', description: '', price: 0, category: '', stock: 0, image_url: '', store_id: null }
  }
}

const editStore = (store) => {
  editingStore.value = { ...store }
  showEditStoreModal.value = true
}

const updateStore = async () => {
  const result = await adminStore.updateStore(editingStore.value.id, editingStore.value)
  if (result.success) {
    showEditStoreModal.value = false
    editingStore.value = { id: null, name: '', description: '', address: '', phone: '', city: '', state: '' }
  }
}

const deleteStore = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta loja?')) {
    const result = await adminStore.deleteStore(id)
    if (result.success) {
      // Dados já foram atualizados no store
    }
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
    editingProduct.value = { id: null, name: '', description: '', price: 0, category: '', stock: 0, image_url: '', store_id: null }
  }
}

const deleteProduct = async (id) => {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    const result = await adminStore.deleteProduct(id)
    if (result.success) {
      // Dados já foram atualizados no store
    }
  }
}
</script> 