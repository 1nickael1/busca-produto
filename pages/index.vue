<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"/>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <UAvatar
            src="/favicon.ico"
            alt="Logo"
            size="xl"
            class="mx-auto mb-6"
          />
          <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Busca Produtos
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Encontre os melhores produtos nas lojas da sua cidade com facilidade e rapidez
          </p>
          
          <!-- Call to Action -->
          <UCard class="max-w-2xl mx-auto backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
            <div class="text-center py-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Comece sua busca agora!
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                Use a barra de busca no topo da página para encontrar produtos
              </p>
              <UButton
                to="/products"
                color="blue"
                size="lg"
                icon="i-heroicons-magnifying-glass"
              >
                Ver todos os produtos
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-20 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Por que escolher nossa plataforma?
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Encontre os melhores preços e produtos com facilidade
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UCard class="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <template #header>
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </template>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Busca Inteligente
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Encontre produtos rapidamente com nossa busca avançada
            </p>
          </UCard>
          
          <UCard class="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <template #header>
              <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-currency-dollar" class="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </template>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Melhores Preços
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Compare preços entre diferentes lojas
            </p>
          </UCard>
          
          <UCard class="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <template #header>
              <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-map-pin" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </template>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Lojas Próximas
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Encontre lojas na sua região
            </p>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  name: 'HomePage'
})
</script> 