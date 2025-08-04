import { useAuthStore } from '@/stores/auth'
import { defineStore } from 'pinia'

interface UserProfile {
  id: number
  email: string
  name: string
  role: string
}

interface UserState {
  profile: UserProfile | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    loading: false
  }),

  actions: {
    async updateProfile(profileData: Partial<UserProfile>) {
      this.loading = true
      try {
        const updatedProfile = await $fetch<UserProfile>('/api/users/profile', {
          method: 'PUT',
          body: profileData
        })
        this.profile = updatedProfile
        return { success: true, profile: updatedProfile }
      } catch (error: any) {
        return { success: false, error: error.data?.error || 'Erro ao atualizar perfil' }
      } finally {
        this.loading = false
      }
    },

    async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
      try {
        const authStore = useAuthStore()
        await $fetch('/api/users/change-password', {
          method: 'POST',
          body: passwordData,
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.data?.statusMessage || error.data?.error || 'Erro ao alterar senha' }
      }
    },

    async changeEmail(emailData: { currentPassword: string; newEmail: string }) {
      try {
        const authStore = useAuthStore()
        const result = await $fetch<{ newEmail: string }>('/api/users/change-email', {
          method: 'POST',
          body: emailData,
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        // Atualizar email no store de auth
        if (authStore.user) {
          authStore.updateUser({ email: result.newEmail })
        }
        
        return { success: true, newEmail: result.newEmail }
      } catch (error: any) {
        return { success: false, error: error.data?.statusMessage || error.data?.error || 'Erro ao alterar email' }
      }
    }
  },

  persist: true
}) 