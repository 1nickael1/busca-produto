import { useAuthStore } from "@/stores/auth"
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"

export default defineNuxtRouteMiddleware((_to) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
    return navigateTo('/login')
  }
}) 