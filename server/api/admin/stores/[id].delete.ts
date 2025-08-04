import { findStoreById, loadData, saveData } from '@/server/data'

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

    // Remover loja da lista
    data.stores = data.stores.filter(s => s.id !== parseInt(id))
    saveData(data)

    return {
      success: true,
      message: 'Loja deletada com sucesso'
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