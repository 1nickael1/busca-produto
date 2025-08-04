import { findStoreById, loadData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    // Carregar dados dinâmicos
    const data = loadData()
    
    // Buscar loja
    const store = findStoreById(parseInt(id), data)

    if (!store) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Loja não encontrada'
      })
    }

    return {
      success: true,
      store: store
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
}) 