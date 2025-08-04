import { findStoreById, getNextId, getProductsByStoreId, loadData, saveData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Dados recebidos no endpoint:', body)
    const { name, description, price, category, store_id, stock = 0, image_url = null } = body

    console.log('Campos extraídos:', {
      name,
      description,
      price,
      category,
      store_id,
      stock,
      image_url
    })

    // Validações básicas
    if (!name || name.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nome é obrigatório'
      })
    }
    
    if (!description || description.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Descrição é obrigatória'
      })
    }
    
    if (price === null || price === undefined || price <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Preço deve ser maior que zero'
      })
    }
    
    if (!category || category.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Categoria é obrigatória'
      })
    }
    
    if (!store_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Loja é obrigatória'
      })
    }

    if (price <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Preço deve ser maior que zero'
      })
    }

    if (stock < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Estoque não pode ser negativo'
      })
    }

    // Carregar dados dinâmicos
    const data = loadData()

    // Verificar se a loja existe
    const store = findStoreById(store_id, data)
    if (!store) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Loja não encontrada'
      })
    }

    // Criar novo produto
    const newProduct = {
      id: getNextId('products', data),
      name,
      description,
      price: parseFloat(price),
      category,
      store_id: parseInt(store_id),
      stock: parseInt(stock),
      image_url,
      created_at: new Date().toISOString()
    }

    // Adicionar produto aos dados
    data.products.push(newProduct)
    saveData(data)

    // Atualizar contador de produtos da loja
    const storeIndex = data.stores.findIndex((s: { id: number }) => s.id === store_id)
    if (storeIndex !== -1) {
      data.stores[storeIndex].products_count = getProductsByStoreId(store_id, data).length
      saveData(data)
    }

    return {
      success: true,
      message: 'Produto criado com sucesso',
      product: newProduct
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