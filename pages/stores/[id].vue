<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="store" class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ store.name }}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-xl font-semibold mb-4">Informações da Loja</h2>
          
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">Endereço</label>
              <p class="text-gray-900">{{ store.address }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Cidade/Estado</label>
              <p class="text-gray-900">{{ store.city }}, {{ store.state }}</p>
            </div>
            
            <div v-if="store.phone">
              <label class="block text-sm font-medium text-gray-700">Telefone</label>
              <p class="text-gray-900">{{ store.phone }}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 class="text-xl font-semibold mb-4">Localização</h2>
          <div class="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center">
            <p class="text-gray-500">Mapa da localização</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Produtos da Loja -->
    <div v-if="storeProducts.length > 0" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-6">Produtos Disponíveis</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in storeProducts"
          :key="product.id"
          class="border rounded-lg p-4"
        >
          <div v-if="product.image_url" class="mb-4">
            <img
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-32 object-cover rounded-md"
            />
          </div>
          
          <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
          <p class="text-gray-600 mb-2">{{ product.description }}</p>
          <p class="text-green-600 font-semibold text-lg mb-2">R$ {{ product.price }}</p>
          <p class="text-sm text-gray-500">Estoque: {{ product.stock }} unidades</p>
        </div>
      </div>
    </div>
    
    <!-- Mensagem quando não há produtos -->
    <div v-else-if="store" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-4">Produtos</h2>
      <p class="text-gray-600">Esta loja ainda não possui produtos cadastrados.</p>
    </div>
    
    <!-- Loading -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600">Carregando...</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const store = ref(null)
const storeProducts = ref([])

const loadStore = async () => {
  try {
    const response = await $fetch(`/api/stores/${route.params.id}`)
    store.value = response.store
    storeProducts.value = response.store.products || []
  } catch (error) {
    console.error('Erro ao carregar loja:', error)
    store.value = null
    storeProducts.value = []
  }
}

// Carregar dados da loja
await loadStore()
</script> 