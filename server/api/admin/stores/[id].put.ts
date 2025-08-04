import { findStoreById, loadData, saveData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
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

    // Atualizar dados da loja
    const updatedStore = {
      ...store,
      ...body,
      id: store.id, // Manter ID original
      created_at: store.created_at // Manter data de criação
    }

    // Atualizar na lista
    const storeIndex = data.stores.findIndex(s => s.id === parseInt(id))
    if (storeIndex !== -1) {
      data.stores[storeIndex] = updatedStore
      saveData(data)
    }

    return {
      success: true,
      message: 'Loja atualizada com sucesso',
      store: updatedStore
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