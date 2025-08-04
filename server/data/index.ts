// Sistema de dados dinâmico para o backend
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Interfaces
export interface User {
  id: number
  name: string
  email: string
  password: string
  role: 'user' | 'admin' | 'store_admin'
  created_at: string
  store_id?: number // Para store_admin
}

export interface DatabaseData {
  users: User[]
  stores: Store[]
  products: Product[]
}

export interface Store {
  id: number
  name: string
  description: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  website: string
  image_url: string | null
  rating: number
  products_count: number
  created_at: string
  products: Product[]
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string | null
  category: string
  store_id: number
  stock: number
  created_at: string
}

// Caminho para o arquivo de dados
const DATA_FILE = join(process.cwd(), 'server', 'data', 'database.json')

// Dados iniciais
const initialData = {
  users: [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      password: '123456',
      role: 'user' as const,
      created_at: '2024-01-01T10:00:00Z'
    },
    {
      id: 2,
      name: 'Root',
      email: 'root@root.com',
      password: '123456',
      role: 'admin' as const,
      created_at: '2024-01-01T10:00:00Z'
    }
  ],
  stores: [
    {
      id: 1,
      name: 'Apple Store',
      description: 'Loja oficial da Apple com produtos premium',
      address: 'Rua Augusta, 123',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 99999-9999',
      email: 'contato@applestore.com.br',
      website: 'https://www.apple.com.br',
      image_url: null,
      rating: 4.8,
      products_count: 2,
      created_at: '2024-01-15T10:00:00Z',
      products: [
        {
          id: 1,
          name: 'iPhone 15',
          description: 'Smartphone Apple com câmera avançada',
          price: 5999.99,
          image_url: null,
          category: 'Smartphones',
          store_id: 1,
          stock: 50,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'MacBook Pro',
          description: 'Notebook profissional para desenvolvedores',
          price: 12999.99,
          image_url: null,
          category: 'Notebooks',
          store_id: 1,
          stock: 20,
          created_at: '2024-01-15T10:00:00Z'
        }
      ]
    },
    {
      id: 2,
      name: 'Samsung Store',
      description: 'Loja oficial Samsung com smartphones e eletrônicos',
      address: 'Av. Paulista, 456',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 88888-8888',
      email: 'contato@samsungstore.com.br',
      website: 'https://www.samsung.com.br',
      image_url: null,
      rating: 4.5,
      products_count: 1,
      created_at: '2024-01-20T14:30:00Z',
      products: [
        {
          id: 3,
          name: 'Samsung Galaxy S24',
          description: 'Smartphone Android com IA integrada',
          price: 4999.99,
          image_url: null,
          category: 'Smartphones',
          store_id: 2,
          stock: 30,
          created_at: '2024-01-20T14:30:00Z'
        }
      ]
    },
    {
      id: 3,
      name: 'Magazine Luiza',
      description: 'Loja de departamentos com variedade de produtos',
      address: 'Rua das Flores, 789',
      city: 'Rio de Janeiro',
      state: 'RJ',
      phone: '(21) 77777-7777',
      email: 'contato@magazineluiza.com.br',
      website: 'https://www.magazineluiza.com.br',
      image_url: null,
      rating: 4.2,
      products_count: 0,
      created_at: '2024-02-01T09:15:00Z',
      products: []
    },
    {
      id: 4,
      name: 'Americanas',
      description: 'Rede de lojas com produtos para toda família',
      address: 'Av. Copacabana, 321',
      city: 'Rio de Janeiro',
      state: 'RJ',
      phone: '(21) 66666-6666',
      email: 'contato@americanas.com.br',
      website: 'https://www.americanas.com.br',
      image_url: null,
      rating: 4.0,
      products_count: 0,
      created_at: '2024-02-10T16:45:00Z',
      products: []
    },
    {
      id: 5,
      name: 'Casas Bahia',
      description: 'Especializada em móveis e eletrodomésticos',
      address: 'Rua do Comércio, 654',
      city: 'Belo Horizonte',
      state: 'MG',
      phone: '(31) 55555-5555',
      email: 'contato@casasbahia.com.br',
      website: 'https://www.casasbahia.com.br',
      image_url: null,
      rating: 4.3,
      products_count: 0,
      created_at: '2024-02-15T11:20:00Z',
      products: []
    }
  ],
  products: [
    {
      id: 1,
      name: 'iPhone 15',
      description: 'Smartphone Apple com câmera avançada',
      price: 5999.99,
      image_url: null,
      category: 'Smartphones',
      store_id: 1,
      stock: 50,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'MacBook Pro',
      description: 'Notebook profissional para desenvolvedores',
      price: 12999.99,
      image_url: null,
      category: 'Notebooks',
      store_id: 1,
      stock: 20,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24',
      description: 'Smartphone Android com IA integrada',
      price: 4999.99,
      image_url: null,
      category: 'Smartphones',
      store_id: 2,
      stock: 30,
      created_at: '2024-01-20T14:30:00Z'
    }
  ]
}

// Funções para gerenciar dados
export function loadData() {
  try {
    if (existsSync(DATA_FILE)) {
      const data = readFileSync(DATA_FILE, 'utf-8')
      return JSON.parse(data)
    } else {
      // Criar arquivo com dados iniciais
      saveData(initialData)
      return initialData
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    return initialData
  }
}

export function saveData(data: DatabaseData) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Erro ao salvar dados:', error)
  }
}

export function getNextId(collection: keyof DatabaseData, data: DatabaseData): number {
  const items = data[collection]
  if (!items || items.length === 0) return 1
  return Math.max(...items.map((item: { id: number }) => item.id)) + 1
}

export function findUserByEmail(email: string, data: DatabaseData): User | null {
  return data.users.find((user: User) => user.email === email) || null
}

export function findUserById(id: number, data: DatabaseData): User | null {
  return data.users.find((user: User) => user.id === id) || null
}

export function findStoreById(id: number, data: DatabaseData): Store | null {
  return data.stores.find((store: Store) => store.id === id) || null
}

export function findProductById(id: number, data: DatabaseData): Product | null {
  return data.products.find((product: Product) => product.id === id) || null
}

export function getProductsByStoreId(storeId: number, data: DatabaseData): Product[] {
  return data.products.filter((product: Product) => product.store_id === storeId)
}

export function searchProducts(query: string, city: string | undefined, data: DatabaseData): Product[] {
  let products = data.products

  // Filtrar por nome ou descrição
  if (query) {
    const searchTerm = query.toLowerCase()
    products = products.filter((product: Product) => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    )
  }

  // Filtrar por cidade (através da loja)
  if (city) {
    const cityTerm = city.toLowerCase()
    const storeIds = data.stores
      .filter((store: Store) => store.city.toLowerCase().includes(cityTerm))
      .map((store: Store) => store.id)
    
    products = products.filter((product: Product) => 
      storeIds.includes(product.store_id)
    )
  }

  return products
} 