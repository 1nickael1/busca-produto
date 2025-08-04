<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Meu Perfil - Administrador</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Informações do Admin -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Informações Pessoais</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <p class="text-gray-900">{{ authStore.user?.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p class="text-gray-900">{{ authStore.user?.email }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
            <span class="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              Administrador
            </span>
          </div>
        </div>
      </div>
      
      <!-- Alterar Senha -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Alterar Senha</h2>
        
        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Senha Atual
            </label>
            <input
              id="currentPassword"
              v-model="currentPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha atual"
            />
          </div>
          
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Nova Senha
            </label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite a nova senha"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nova Senha
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirme a nova senha"
            />
          </div>
          
          <div v-if="error" class="text-red-600 text-center">
            {{ error }}
          </div>
          
          <div v-if="success" class="text-green-600 text-center">
            Senha alterada com sucesso!
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="loading">Alterando...</span>
            <span v-else>Alterar Senha</span>
          </button>
        </form>
      </div>
    </div>
    
    <!-- Links de Navegação -->
    <div class="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Ações Administrativas</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          to="/admin/dashboard"
          class="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <h3 class="font-semibold text-blue-600">Dashboard</h3>
          <p class="text-sm text-gray-600">Voltar ao dashboard principal</p>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/admins"
          class="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <h3 class="font-semibold text-purple-600">Gerenciar Admins</h3>
          <p class="text-sm text-gray-600">Criar novos administradores</p>
        </NuxtLink>
        
        <button
          @click="logout"
          class="block p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left w-full"
        >
          <h3 class="font-semibold text-red-600">Sair</h3>
          <p class="text-sm text-gray-600">Fazer logout do sistema</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['admin']
})

const authStore = useAuthStore()
const adminStore = useAdminStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem'
    return
  }
  
  if (newPassword.value.length < 6) {
    error.value = 'A nova senha deve ter pelo menos 6 caracteres'
    return
  }
  
  loading.value = true
  error.value = ''
  success.value = false
  
  const result = await adminStore.changePassword({
    currentPassword: currentPassword.value,
    newPassword: newPassword.value
  })
  
  if (result.success) {
    success.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } else {
    error.value = result.error
  }
  
  loading.value = false
}

const logout = () => {
  authStore.logout()
  navigateTo('/')
}
</script> 