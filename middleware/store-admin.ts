import { useAuthStore } from "@/stores/auth"
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Verificar se está autenticado
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  // Verificar se é store_admin
  if (authStore.user?.role !== 'store_admin') {
    return navigateTo('/')
  }
  
  // Para store_admin, verificar se está acessando sua própria loja
  if (to.params.id) {
    const storeId = parseInt(to.params.id as string)
    if (authStore.user?.store_id !== storeId) {
      return navigateTo('/')
    }
  }
}) 