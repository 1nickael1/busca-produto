<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Informações Pessoais</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <p class="text-gray-900">{{ authStore.user?.role === 'admin' ? 'Administrador' : 'Usuário' }}</p>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        to="/profile/change-password"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold mb-2">Alterar Senha</h3>
        <p class="text-gray-600">Atualize sua senha de acesso</p>
      </NuxtLink>
      
      <NuxtLink
        to="/profile/change-email"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold mb-2">Alterar Email</h3>
        <p class="text-gray-600">Modifique seu endereço de email</p>
      </NuxtLink>
      
      <button
        @click="showDeleteModal = true"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
      >
        <h3 class="text-lg font-semibold mb-2 text-red-600">Excluir Conta</h3>
        <p class="text-gray-600">Remover permanentemente sua conta</p>
      </button>
    </div>
    
    <!-- Modal de exclusão -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
        <p class="text-gray-600 mb-6">
          Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
        </p>
        
        <div class="flex space-x-4">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="deleteAccount"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()
const showDeleteModal = ref(false)

const deleteAccount = () => {
  // Implementar exclusão de conta
  showDeleteModal.value = false
  authStore.logout()
  navigateTo('/')
}
</script> 