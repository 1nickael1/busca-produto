<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <UCard class="max-w-md w-full">
      <template #header>
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Criar nova conta
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Preencha os dados para criar sua conta
          </p>
        </div>
      </template>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome completo
          </label>
          <UInput
            v-model="name"
            type="text"
            placeholder="Seu nome completo"
            required
            icon="i-heroicons-user"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <UInput
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
            icon="i-heroicons-envelope"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Senha
          </label>
          <UInput
            v-model="password"
            type="password"
            placeholder="Sua senha"
            required
            icon="i-heroicons-lock-closed"
          />
        </div>

        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
        >
          {{ error }}
        </UAlert>

        <UButton
          type="submit"
          :loading="loading"
          block
          color="blue"
          size="lg"
        >
          {{ loading ? 'Criando conta...' : 'Criar conta' }}
        </UButton>
      </form>

      <template #footer>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?
            <NuxtLink to="/login" class="text-blue-600 hover:text-blue-500 font-medium">
              Faça login
            </NuxtLink>
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value
  })
  
  if (result.success) {
    navigateTo('/')
  } else {
    error.value = result.error
  }
  
  loading.value = false
}
</script> 