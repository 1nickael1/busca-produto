<template>
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Lojas</h1>
    
    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Filtrar Lojas</h2>
      
      <form @submit.prevent="filterStores" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
          <input
            v-model="nameFilter"
            type="text"
            placeholder="Digite o nome da loja..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <input
            v-model="cityFilter"
            type="text"
            placeholder="Digite a cidade..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="flex items-end">
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Filtrar
          </button>
        </div>
      </form>
    </div>
    
    <!-- Lista de Lojas -->
    <div v-if="filteredStores.length > 0">
      <h2 class="text-2xl font-semibold mb-4">Lojas Encontradas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="store in filteredStores"
          :key="store.id"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h3 class="font-semibold text-lg mb-2">{{ store.name }}</h3>
          <p class="text-gray-600 mb-2">{{ store.address }}</p>
          <p class="text-gray-600 mb-2">{{ store.city }}, {{ store.state }}</p>
          
          <div v-if="store.phone" class="mb-4">
            <p class="text-sm text-gray-500">
              <span class="font-medium">Telefone:</span> {{ store.phone }}
            </p>
          </div>
          
          <div class="mt-4">
            <NuxtLink
              :to="`/stores/${store.id}`"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver detalhes →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mensagem quando não há resultados -->
    <div v-else-if="hasFiltered" class="text-center py-8">
      <p class="text-gray-600">Nenhuma loja encontrada com os critérios informados.</p>
    </div>
    
    <!-- Lista inicial de todas as lojas -->
    <div v-else>
      <h2 class="text-2xl font-semibold mb-4">Todas as Lojas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="store in stores"
          :key="store.id"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h3 class="font-semibold text-lg mb-2">{{ store.name }}</h3>
          <p class="text-gray-600 mb-2">{{ store.address }}</p>
          <p class="text-gray-600 mb-2">{{ store.city }}, {{ store.state }}</p>
          
          <div v-if="store.phone" class="mb-4">
            <p class="text-sm text-gray-500">
              <span class="font-medium">Telefone:</span> {{ store.phone }}
            </p>
          </div>
          
          <div class="mt-4">
            <NuxtLink
              :to="`/stores/${store.id}`"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver detalhes →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stores = ref([])
const filteredStores = ref([])
const nameFilter = ref('')
const cityFilter = ref('')
const hasFiltered = ref(false)

// Carregar todas as lojas
const loadStores = async () => {
  try {
    const response = await $fetch('/api/stores')
    stores.value = response.stores
  } catch (error) {
    console.error('Erro ao carregar lojas:', error)
    stores.value = []
  }
}

const filterStores = () => {
  hasFiltered.value = true
  
  filteredStores.value = stores.value.filter(store => {
    const nameMatch = !nameFilter.value || 
      store.name.toLowerCase().includes(nameFilter.value.toLowerCase())
    const cityMatch = !cityFilter.value || 
      store.city.toLowerCase().includes(cityFilter.value.toLowerCase())
    
    return nameMatch && cityMatch
  })
}

// Carregar lojas na inicialização
await loadStores()
</script> 