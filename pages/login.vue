<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <UCard class="max-w-md w-full">
      <template #header>
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Entrar na sua conta
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Acesse sua conta para continuar
          </p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </UButton>
      </form>

      <template #footer>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?
            <NuxtLink to="/register" class="text-blue-600 hover:text-blue-500 font-medium">
              Cadastre-se
            </NuxtLink>
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login({
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