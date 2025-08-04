<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Alterar Email</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6 p-4 bg-gray-50 rounded-md">
        <p class="text-sm text-gray-600 mb-2">Email atual:</p>
        <p class="text-lg font-medium text-gray-900">{{ currentEmail }}</p>
      </div>
      
      <form @submit.prevent="handleChangeEmail" class="space-y-6">
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
            placeholder="Digite sua senha para confirmar"
          />
        </div>
        
        <div>
          <label for="newEmail" class="block text-sm font-medium text-gray-700 mb-2">
            Novo Email
          </label>
          <input
            id="newEmail"
            v-model="newEmail"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o novo email"
          />
        </div>
        
        <div v-if="error" class="text-red-600 text-center">
          {{ error }}
        </div>
        
        <div v-if="success" class="text-green-600 text-center">
          Email alterado com sucesso!
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
            <span v-else>Alterar Email</span>
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
const authStore = useAuthStore()

const currentPassword = ref('')
const newEmail = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

// Computed property para o email atual
const currentEmail = computed(() => authStore.user?.email || 'Carregando...')

const handleChangeEmail = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  
  const result = await userStore.changeEmail({
    currentPassword: currentPassword.value,
    newEmail: newEmail.value
  })
  
  if (result.success) {
    success.value = true
    currentPassword.value = ''
    newEmail.value = ''
  } else {
    error.value = result.error
  }
  
  loading.value = false
}
</script> 