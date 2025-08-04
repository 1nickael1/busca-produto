import { findProductById, loadData, saveData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    // Carregar dados dinâmicos
    const data = loadData()
    
    // Buscar produto
    const product = findProductById(parseInt(id), data)

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Produto não encontrado'
      })
    }

    // Remover produto da lista
    data.products = data.products.filter(p => p.id !== parseInt(id))
    saveData(data)

    return {
      success: true,
      message: 'Produto deletado com sucesso'
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