import { loadData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Carregar dados dinâmicos
    const data = loadData()
    
    let products = data.products

    // Filtrar por categoria
    if (query.category) {
      const category = query.category.toString().toLowerCase()
      products = products.filter(product => 
        product.category.toLowerCase().includes(category)
      )
    }

    // Filtrar por preço mínimo
    if (query.minPrice) {
      const minPrice = parseFloat(query.minPrice.toString())
      products = products.filter(product => product.price >= minPrice)
    }

    // Filtrar por preço máximo
    if (query.maxPrice) {
      const maxPrice = parseFloat(query.maxPrice.toString())
      products = products.filter(product => product.price <= maxPrice)
    }

    // Ordenar por preço
    if (query.sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price)
    } else if (query.sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price)
    }

    // Ordenar por nome (padrão)
    if (!query.sort || query.sort === 'name') {
      products.sort((a, b) => a.name.localeCompare(b.name))
    }

    // Adicionar informações da loja
    const productsWithStore = products.map(product => {
      const store = data.stores.find(s => s.id === product.store_id)
      return {
        ...product,
        store_name: store?.name || 'Loja não encontrada',
        store_city: store?.city || '',
        store_state: store?.state || ''
      }
    })

    return {
      success: true,
      products: productsWithStore,
      total: productsWithStore.length,
      total_all: data.products.length
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
}) 