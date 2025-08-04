<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex-shrink-0">
              <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white">
                Busca Produtos
              </NuxtLink>
            </div>
            
            <!-- Barra de Busca -->
            <div class="flex-1 max-w-2xl mx-4">
              <form class="flex items-center space-x-2" @submit.prevent="search">
                <div class="flex-1 relative">
                  <UInput
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar produtos..."
                    size="sm"
                    class="w-full"
                    @focus="showSearchHistory = true"
                    @blur="handleSearchBlur"
                    @input="filterSearchHistory"
                    @keydown.enter="handleEnterKey"
                  />
                  
                  <!-- Dropdown do Histórico -->
                  <div
                    v-if="showSearchHistory && filteredSearchHistory.length > 0"
                    class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
                  >
                    <div
                      v-for="(history, index) in filteredSearchHistory"
                      :key="index"
                      class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      @click="selectSearchHistory(history)"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
                          <span class="text-gray-900 dark:text-white">{{ history.query || 'Busca geral' }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{ formatHistoryDate(history.timestamp) }}</span>
                      </div>
                      <div v-if="history.city" class="text-xs text-gray-500 ml-6">
                        Cidade: {{ history.city }}
                      </div>
                    </div>
                    
                    <!-- Botão para limpar histórico -->
                    <div class="border-t border-gray-200 dark:border-gray-700">
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="clearSearchHistory"
                      >
                        🗑️ Limpar Histórico
                      </button>
                    </div>
                  </div>
                </div>
                
                <UInput
                  v-model="cityQuery"
                  type="text"
                  placeholder="Cidade..."
                  size="sm"
                  class="w-32"
                />
                <UButton
                  type="submit"
                  color="blue"
                  size="sm"
                >
                  Buscar
                </UButton>
              </form>
            </div>
            
            <!-- Navegação -->
            <nav class="flex items-center space-x-4">
              <NuxtLink to="/products">
                <UButton variant="ghost" color="gray" size="sm">
                  Produtos
                </UButton>
              </NuxtLink>
              <NuxtLink to="/stores-list">
                <UButton variant="ghost" color="gray" size="sm">
                  Lojas
                </UButton>
              </NuxtLink>
              
              <div v-if="authStore.isAuthenticated" class="relative user-menu">
                <button
                  class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-md"
                  @click="showUserMenu = !showUserMenu"
                >
                  <span class="mr-1">👤</span>
                  {{ authStore.user?.name }}
                  <span class="ml-1">▼</span>
                </button>
                
                <!-- Menu dropdown -->
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                >
                  <NuxtLink
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="showUserMenu = false"
                  >
                    👤 Perfil
                  </NuxtLink>
                  
                  <NuxtLink
                    v-if="authStore.user?.role === 'admin'"
                    to="/admin/dashboard"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="showUserMenu = false"
                  >
                    📊 Dashboard Admin
                  </NuxtLink>
                  
                  <NuxtLink
                    v-if="authStore.user?.role === 'admin'"
                    to="/admin/admins"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="showUserMenu = false"
                  >
                    👥 Gerenciar Admins
                  </NuxtLink>
                  
                  <NuxtLink
                    v-if="authStore.user?.role === 'store_admin'"
                    to="/store-admin/dashboard"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="showUserMenu = false"
                  >
                    🏪 Dashboard da Loja
                  </NuxtLink>
                  
                  <button
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="logout"
                  >
                    🚪 Sair
                  </button>
                </div>
              </div>
              
              <div v-else class="flex items-center space-x-2">
                <NuxtLink to="/login">
                  <UButton variant="ghost" color="gray" size="sm">
                    Login
                  </UButton>
                </NuxtLink>
                <NuxtLink to="/register">
                  <UButton color="blue" size="sm">
                    Cadastrar
                  </UButton>
                </NuxtLink>
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>

<script setup>
const authStore = useAuthStore()

const searchQuery = ref('')
const cityQuery = ref('')
const showUserMenu = ref(false)
const showSearchHistory = ref(false)
const searchHistory = ref([])
const filteredSearchHistory = ref([])

// Carregar histórico do localStorage
onMounted(() => {
  loadSearchHistory()
})

const loadSearchHistory = () => {
  try {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      searchHistory.value = JSON.parse(history)
    }
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    searchHistory.value = []
  }
}

const filterSearchHistory = () => {
  if (!searchQuery.value) {
    filteredSearchHistory.value = searchHistory.value.slice(0, 5)
  } else {
    filteredSearchHistory.value = searchHistory.value.filter(history => 
      history.query?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      history.city?.toLowerCase().includes(searchQuery.value.toLowerCase())
    ).slice(0, 5)
  }
}

const selectSearchHistory = (history) => {
  searchQuery.value = history.query || ''
  cityQuery.value = history.city || ''
  showSearchHistory.value = false
  
  // Executar busca automaticamente
  search()
}

const handleSearchBlur = () => {
  // Delay para permitir cliques nos itens do histórico
  setTimeout(() => {
    showSearchHistory.value = false
  }, 200)
}

const handleEnterKey = () => {
  // Fechar dropdown do histórico
  showSearchHistory.value = false
  
  // Executar busca
  search()
}

const clearSearchHistory = () => {
  if (confirm('Tem certeza que deseja limpar todo o histórico de pesquisa?')) {
    searchHistory.value = []
    filteredSearchHistory.value = []
    localStorage.removeItem('searchHistory')
  }
}

const formatHistoryDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Agora'
  } else if (diffInHours < 24) {
    return `${diffInHours}h atrás`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }
}

const search = async () => {
  if (!searchQuery.value && !cityQuery.value) {
    return
  }
  
  // Salvar no histórico
  saveToHistory(searchQuery.value, cityQuery.value)
  
  // Redirecionar para a página de produtos com os parâmetros de busca
  const params = new URLSearchParams()
  if (searchQuery.value) params.append('q', searchQuery.value)
  if (cityQuery.value) params.append('city', cityQuery.value)
  
  await navigateTo(`/products?${params.toString()}`)
}

const saveToHistory = (query, city) => {
  try {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    
    const historyEntry = {
      query,
      city,
      timestamp: new Date().toISOString()
    }
    
    // Remover duplicatas
    const filteredHistory = history.filter(item => 
      !(item.query === query && item.city === city)
    )
    
    // Adicionar no início da lista
    filteredHistory.unshift(historyEntry)
    
    // Manter apenas os últimos 10 registros
    if (filteredHistory.length > 10) {
      filteredHistory = filteredHistory.slice(0, 10)
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(filteredHistory))
    searchHistory.value = filteredHistory
  } catch (error) {
    console.error('Erro ao salvar histórico:', error)
  }
}

const logout = () => {
  authStore.logout()
  showUserMenu.value = false
  navigateTo('/')
}
</script> 