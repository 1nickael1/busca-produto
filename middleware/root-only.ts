import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { useAuthStore } from "@/stores/auth"

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  // Verificar se está autenticado
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  // Verificar se é root admin
  if (authStore.user?.role !== 'admin') {
    return navigateTo('/')
  }
}) 