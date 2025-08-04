import { loadData, searchProducts } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Carregar dados dinâmicos
    const data = loadData()
    
    // Buscar produtos
    const searchTerm = query.q?.toString() || ''
    const cityTerm = query.city?.toString()
    
    const products = searchProducts(searchTerm, cityTerm, data)
    
    // Formatar resultados com informações da loja
    const results = products.map(product => {
      const store = data.stores.find(s => s.id === product.store_id)
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        store_name: store?.name || 'Loja não encontrada',
        city: store?.city || '',
        state: store?.state || '',
        store_id: product.store_id,
        image_url: product.image_url
      }
    })
    
    return {
      results,
      total: results.length
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
}) 