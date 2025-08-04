import { findProductById, loadData, saveData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
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

    // Atualizar dados do produto
    const updatedProduct = {
      ...product,
      ...body,
      id: product.id, // Manter ID original
      created_at: product.created_at // Manter data de criação
    }

    // Atualizar na lista
    const productIndex = data.products.findIndex(p => p.id === parseInt(id))
    if (productIndex !== -1) {
      data.products[productIndex] = updatedProduct
      saveData(data)
    }

    return {
      success: true,
      message: 'Produto atualizado com sucesso',
      product: updatedProduct
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