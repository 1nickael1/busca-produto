<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Alterar Senha</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="handleChangePassword" class="space-y-6">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
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
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
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
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
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
        
        <div class="flex space-x-4">
          <NuxtLink
            to="/profile"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-center"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="loading">Alterando...</span>
            <span v-else>Alterar Senha</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const userStore = useUserStore()

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
  
  const result = await userStore.changePassword({
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
</script> 