import { defineStore } from 'pinia'

interface Store {
  id: number
  name: string
  address: string
  phone: string
  city: string
  state: string
  is_active: boolean
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  store_id: number
  stock: number
  image_url: string
  created_at: string
}

interface Admin {
  id: number
  email: string
  name: string
  role: 'admin' | 'store_admin'
  store_id?: number
  created_at: string
}

interface AdminState {
  stores: Store[]
  products: Product[]
  admins: Admin[]
  loading: boolean
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    stores: [],
    products: [],
    admins: [],
    loading: false
  }),

  actions: {
    async fetchStores() {
      this.loading = true
      try {
        const response = await $fetch('/api/admin/stores')
        this.stores = response.stores || []
      } catch (error) {
        console.error('Erro ao buscar lojas:', error)
        // Manter dados existentes em caso de erro
        if (this.stores.length === 0) {
          this.stores = []
        }
      } finally {
        this.loading = false
      }
    },

    async createStore(storeData: Omit<Store, 'id' | 'is_active'>) {
      try {
        const newStore = await $fetch('/api/admin/stores', {
          method: 'POST',
          body: storeData
        })
        this.stores.push(newStore)
        return { success: true, store: newStore }
      } catch (error: any) {
        return { success: false, error: error.data?.error || 'Erro ao criar loja' }
      }
    },

    async updateStore(id: number, storeData: Partial<Store>) {
      try {
        await $fetch(`/api/admin/stores/${id}`, {
          method: 'PUT',
          body: storeData
        })
        
        const index = this.stores.findIndex(store => store.id === id)
        if (index !== -1) {
          this.stores[index] = { ...this.stores[index], ...storeData }
        }
        
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.data?.error || 'Erro ao atualizar loja' }
      }
    },

    async deleteStore(id: number) {
      try {
        await $fetch(`/api/admin/stores/${id}`, {
          method: 'DELETE'
        })
        
        this.stores = this.stores.filter(store => store.id !== id)
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.data?.error || 'Erro ao deletar loja' }
      }
    },

    async fetchProducts() {
      this.loading = true
      try {
        const response = await $fetch('/api/admin/products')
        this.products = response.products || []
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
        // Manter dados existentes em caso de erro
        if (this.products.length === 0) {
          this.products = []
        }
      } finally {
        this.loading = false
      }
    },

    async createProduct(productData: any) {
      try {
        console.log('Enviando dados para API:', productData)
        console.log('Tipo dos dados:', typeof productData)
        console.log('Campos obrigatórios:', {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          store_id: productData.store_id
        })
        
        const newProduct = await $fetch('/api/admin/products', {
          method: 'POST',
          body: productData
        })
        console.log('Resposta da API:', newProduct)
        this.products.push(newProduct.product)
        return { success: true, product: newProduct.product }
      } catch (error: any) {
        console.error('Erro na API:', error)
        console.error('Detalhes do erro:', error.data)
        return { success: false, error: error.data?.statusMessage || error.data?.error || 'Erro ao criar produto' }
      }
    },

    async updateProduct(id: number, productData: Partial<Product>) {
      try {
        await $fetch(`/api/admin/products/${id}`, {
          method: 'PUT',
          body: productData
        })
        
        const index = this.products.findIndex(product => product.id === id)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...productData }
        }
        
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.data?.error || 'Erro ao atualizar produto' }
      }
    },

    async deleteProduct(id: number) {
      try {
        await $fetch(`/api/admin/products/${id}`, {
          method: 'DELETE'
        })
        
        this.products = this.products.filter(product => product.id !== id)
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.data?.error || 'Erro ao deletar produto' }
      }
    },

    async fetchAdmins() {
      this.loading = true
      try {
        const response = await $fetch('/api/admin/admins')
        this.admins = response.admins || []
      } catch (error) {
        console.error('Erro ao buscar admins:', error)
        this.admins = []
      } finally {
        this.loading = false
      }
    },

    async createAdmin(adminData: { email: string; name: string; password: string; role: 'admin' | 'store_admin'; store_id?: number }) {
      try {
        const newAdmin = await $fetch('/api/admin/admins', {
          method: 'POST',
          body: adminData
        })
        this.admins.push(newAdmin.admin)
        return { success: true, admin: newAdmin.admin }
      } catch (error: any) {
        return { success: false, error: error.data?.error || 'Erro ao criar administrador' }
      }
    },

    async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
      try {
        // Implementar quando tivermos o endpoint
        console.log('Alterar senha:', passwordData)
        return { success: false, error: 'Endpoint não implementado' }
      } catch (error: any) {
        return { success: false, error: error.data?.error || 'Erro ao alterar senha' }
      }
    }
  },

  persist: true
}) 