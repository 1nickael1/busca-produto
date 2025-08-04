<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Gerenciar Administradores</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Administradores</h2>
        <button
          @click="showCreateAdminModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Administrador
        </button>
      </div>
      
      <div v-if="adminStore.loading" class="text-center py-4">
        <p>Carregando...</p>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="admin in adminStore.admins"
          :key="admin.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ admin.name }}</h3>
              <p class="text-sm text-gray-600">{{ admin.email }}</p>
              <p class="text-xs text-gray-500">Criado em: {{ new Date(admin.created_at).toLocaleDateString() }}</p>
            </div>
            <div class="flex space-x-2">
              <span 
                :class="{
                  'px-2 py-1 text-xs rounded-full': true,
                  'bg-purple-100 text-purple-800': admin.role === 'admin',
                  'bg-green-100 text-green-800': admin.role === 'store_admin'
                }"
              >
                {{ admin.role === 'admin' ? 'Root Admin' : 'Store Admin' }}
              </span>
              <span v-if="admin.store_id" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Loja #{{ admin.store_id }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de criação de admin -->
    <div v-if="showCreateAdminModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Novo Administrador</h3>
        
        <form @submit.prevent="createAdmin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              v-model="newAdmin.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nome completo"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="newAdmin.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="email@exemplo.com"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              v-model="newAdmin.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Senha"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Administrador</label>
            <select
              v-model="newAdmin.role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="admin">Root Admin (Acesso Total)</option>
              <option value="store_admin">Store Admin (Apenas Loja Própria)</option>
            </select>
          </div>
          
          <div v-if="newAdmin.role === 'store_admin'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Loja</label>
            <select
              v-model="newAdmin.store_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :disabled="availableStores.length === 0"
            >
              <option value="">Selecione uma loja</option>
              <option
                v-for="store in availableStores"
                :key="store.id"
                :value="store.id"
              >
                {{ store.name }} - {{ store.city }}/{{ store.state }}
              </option>
            </select>
            <p v-if="availableStores.length === 0" class="text-sm text-red-600 mt-1">
              Todas as lojas já possuem um Store Admin.
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Confirme a senha"
            />
          </div>
          
          <div v-if="error" class="text-red-600 text-center">
            {{ error }}
          </div>
          
          <div class="flex space-x-4">
            <button
              type="button"
              @click="showCreateAdminModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <span v-if="loading">Criando...</span>
              <span v-else>Criar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['admin', 'root-only']
})

const adminStore = useAdminStore()

const showCreateAdminModal = ref(false)
const loading = ref(false)
const error = ref('')

const newAdmin = ref({
  name: '',
  email: '',
  password: '',
  role: 'store_admin',
  store_id: null
})

const confirmPassword = ref('')

// Computed property para lojas disponíveis (sem Store Admin)
const availableStores = computed(() => {
  const storesWithAdmin = adminStore.admins
    .filter(admin => admin.role === 'store_admin' && admin.store_id)
    .map(admin => admin.store_id)
  
  return adminStore.stores.filter(store => !storesWithAdmin.includes(store.id))
})

// Carregar admins e lojas
onMounted(async () => {
  await adminStore.fetchAdmins()
  await adminStore.fetchStores()
})

const createAdmin = async () => {
  if (newAdmin.value.password !== confirmPassword.value) {
    error.value = 'As senhas não coincidem'
    return
  }
  
  if (newAdmin.value.password.length < 6) {
    error.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }
  
  if (newAdmin.value.role === 'store_admin' && !newAdmin.value.store_id) {
    error.value = 'Selecione uma loja para o Store Admin'
    return
  }
  
  if (newAdmin.value.role === 'store_admin' && availableStores.length === 0) {
    error.value = 'Não há lojas disponíveis para criar um Store Admin'
    return
  }
  
  loading.value = true
  error.value = ''
  
  const result = await adminStore.createAdmin(newAdmin.value)
  
  if (result.success) {
    showCreateAdminModal.value = false
    newAdmin.value = { name: '', email: '', password: '', role: 'store_admin', store_id: null }
    confirmPassword.value = ''
  } else {
    error.value = result.error
  }
  
  loading.value = false
}
</script> 