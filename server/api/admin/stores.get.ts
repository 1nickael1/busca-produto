import { loadData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    // Carregar dados dinâmicos
    const data = loadData()
    
    // Obter parâmetros de query para filtros
    const query = getQuery(event)
    let filteredStores = data.stores

    // Filtrar por cidade
    if (query.city) {
      const cityTerm = query.city.toString().toLowerCase()
      filteredStores = filteredStores.filter(store => 
        store.city.toLowerCase().includes(cityTerm)
      )
    }

    // Filtrar por nome da loja
    if (query.name) {
      const nameTerm = query.name.toString().toLowerCase()
      filteredStores = filteredStores.filter(store => 
        store.name.toLowerCase().includes(nameTerm)
      )
    }

    // Ordenar por rating (maior primeiro)
    if (query.sort === 'rating') {
      filteredStores.sort((a, b) => b.rating - a.rating)
    }

    // Ordenar por nome (padrão)
    if (!query.sort || query.sort === 'name') {
      filteredStores.sort((a, b) => a.name.localeCompare(b.name))
    }

    return {
      success: true,
      stores: filteredStores,
      total: filteredStores.length,
      total_all: data.stores.length
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
}) 