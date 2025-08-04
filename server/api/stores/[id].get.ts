import { findStoreById, getProductsByStoreId, loadData } from '@/server/data'

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

    // Buscar produtos da loja
    const products = getProductsByStoreId(store.id, data)
    
    // Adicionar produtos à loja
    const storeWithProducts = {
      ...store,
      products
    }

    return {
      success: true,
      store: storeWithProducts
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