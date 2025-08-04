import { getNextId, loadData, saveData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      name, 
      description, 
      address, 
      city, 
      state, 
      phone, 
      email, 
      website, 
      image_url = null 
    } = body

    // Validações básicas
    if (!name || !description || !address || !city || !state) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nome, descrição, endereço, cidade e estado são obrigatórios'
      })
    }

    // Carregar dados dinâmicos
    const data = loadData()

    // Verificar se já existe uma loja com o mesmo nome na mesma cidade
    const existingStore = data.stores.find(store => 
      store.name.toLowerCase() === name.toLowerCase() && 
      store.city.toLowerCase() === city.toLowerCase()
    )

    if (existingStore) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Já existe uma loja com este nome nesta cidade'
      })
    }

    // Criar nova loja
    const newStore = {
      id: getNextId('stores', data),
      name,
      description,
      address,
      city,
      state,
      phone: phone || null,
      email: email || null,
      website: website || null,
      image_url,
      rating: 0,
      products_count: 0,
      created_at: new Date().toISOString(),
      products: []
    }

    // Adicionar loja aos dados
    data.stores.push(newStore)
    saveData(data)

    return {
      success: true,
      message: 'Loja criada com sucesso',
      store: newStore
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