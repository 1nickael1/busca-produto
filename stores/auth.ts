import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  name: string
  role: string
  store_id?: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(credentials: { email: string; password: string }) {

      console.log(credentials)
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        console.log(response)

        this.user = response.user
        this.token = response.token
        this.isAuthenticated = true

        return { success: true }
      } catch (error: unknown) {
        const errorData = error as { data?: { error?: string } }
        return { success: false, error: errorData.data?.error || 'Erro no login' }
      }
    },

    async register(userData: { email: string; name: string; password: string }) {
      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData
        })

        this.user = response.user
        this.token = response.token || null
        this.isAuthenticated = true

        return { success: true }
      } catch (error: unknown) {
        const errorData = error as { data?: { error?: string } }
        return { success: false, error: errorData.data?.error || 'Erro no registro' }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    },

    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData } as User
      }
    }
  },

  persist: true
}) 