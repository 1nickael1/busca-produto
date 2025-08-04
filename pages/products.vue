<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Produtos</h1>
    
    <!-- Filtros -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Buscar Produtos</h2>
      </template>
      
      <form @submit.prevent="search" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome do Produto
          </label>
          <UInput
            v-model="searchQuery"
            type="text"
            placeholder="Digite o nome do produto..."
            icon="i-heroicons-magnifying-glass"
          />
        </div>
        
        <div>
          <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cidade
          </label>
          <UInput
            v-model="cityQuery"
            type="text"
            placeholder="Digite a cidade..."
            icon="i-heroicons-map-pin"
          />
        </div>
        
        <div class="flex items-end gap-2">
          <UButton
            type="submit"
            block
            color="blue"
            size="lg"
            icon="i-heroicons-magnifying-glass"
            :loading="loading"
          >
            Buscar
          </UButton>
          
          <UButton
            v-if="hasSearched"
            type="button"
            color="gray"
            size="lg"
            icon="i-heroicons-x-mark"
            @click="clearSearch"
          >
            Limpar
          </UButton>
        </div>
      </form>
    </UCard>
    
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">Carregando...</p>
    </div>
    
    <!-- Resultados da Busca -->
    <div v-else-if="hasSearched && searchResults.length > 0">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Resultados da Busca</h2>
      <div class="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="result in searchResults"
          :key="result.id"
          class="hover:shadow-lg transition-shadow"
        >
          <div v-if="result.image_url" class="mb-4">
            <img
              :src="result.image_url"
              :alt="result.name"
              class="w-full h-48 object-cover rounded-md"
            />
          </div>
          
          <template #header>
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ result.name }}</h3>
          </template>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ result.description }}</p>
          
          <div class="space-y-2">
            <p class="text-green-600 font-semibold text-lg">R$ {{ result.price }}</p>
            <div class="flex flex-wrap gap-2">
              <UBadge color="gray" variant="soft">{{ result.store_name }}</UBadge>
              <UBadge color="blue" variant="soft">{{ result.city }}, {{ result.state }}</UBadge>
            </div>
          </div>
          
          <template #footer>
            <NuxtLink
              :to="`/stores/${result.store_id}`"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver detalhes da loja →
            </NuxtLink>
          </template>
        </UCard>
      </div>
    </div>
    
    <!-- Listagem Completa de Produtos -->
    <div v-else-if="!loading && !hasSearched && allProducts.length > 0">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Todos os Produtos</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ allProducts.length }} produtos encontrados</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="product in allProducts"
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
            <div class="flex flex-wrap gap-2">
              <UBadge color="gray" variant="soft">{{ product.store_name }}</UBadge>
              <UBadge color="blue" variant="soft">{{ product.city }}, {{ product.state }}</UBadge>
            </div>
          </div>
          
          <template #footer>
            <NuxtLink
              :to="`/stores/${product.store_id}`"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver detalhes da loja →
            </NuxtLink>
          </template>
        </UCard>
      </div>
    </div>
    
    <!-- Mensagem quando não há resultados da busca -->
    <UCard v-else-if="!loading && hasSearched && searchResults.length === 0" class="text-center">
      <UAlert
        color="yellow"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
      >
        Nenhum produto encontrado com os critérios informados.
      </UAlert>
    </UCard>
    
    <!-- Mensagem quando não há produtos cadastrados -->
    <UCard v-else-if="!loading && !hasSearched && allProducts.length === 0" class="text-center">
      <UAlert
        color="blue"
        variant="soft"
        icon="i-heroicons-information-circle"
      >
        Nenhum produto cadastrado no sistema.
      </UAlert>
    </UCard>
  </div>
</template>

<script setup>
const route = useRoute()

const searchQuery = ref('')
const cityQuery = ref('')
const searchResults = ref([])
const allProducts = ref([])
const hasSearched = ref(false)
const loading = ref(false)

// Carregar todos os produtos
const loadAllProducts = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/products')
    allProducts.value = response.products || []
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    allProducts.value = []
  } finally {
    loading.value = false
  }
}

// Ler parâmetros da URL e preencher os campos
onMounted(async () => {
  // Carregar todos os produtos primeiro
  await loadAllProducts()
  
  if (route.query.q) {
    searchQuery.value = String(route.query.q)
  }
  if (route.query.city) {
    cityQuery.value = String(route.query.city)
  }
  
  // Se há parâmetros na URL, realizar busca automática
  if (route.query.q || route.query.city) {
    search()
  }
})

const search = async () => {
  try {
    loading.value = true
    const params = {}
    if (searchQuery.value) params.q = searchQuery.value
    if (cityQuery.value) params.city = cityQuery.value
    
    const response = await $fetch('/api/search', { params })
    searchResults.value = response.results
    hasSearched.value = true
  } catch (error) {
    console.error('Erro na busca:', error)
    searchResults.value = []
    hasSearched.value = true
  } finally {
    loading.value = false
  }
}

// Limpar busca e mostrar todos os produtos
const clearSearch = () => {
  searchQuery.value = ''
  cityQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
}
</script> 