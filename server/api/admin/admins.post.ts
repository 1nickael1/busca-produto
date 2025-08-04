import { findUserByEmail, getNextId, loadData, saveData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, password, role, store_id } = body

    // Validações básicas
    if (!name || !email || !password || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nome, email, senha e tipo são obrigatórios'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Senha deve ter pelo menos 6 caracteres'
      })
    }

    if (!['admin', 'store_admin'].includes(role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tipo de administrador inválido'
      })
    }

    // Carregar dados dinâmicos
    const data = loadData()

    // Verificar se email já existe
    const existingUser = findUserByEmail(email, data)
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email já está em uso'
      })
    }

    // Verificar se store_id é válido para store_admin
    if (role === 'store_admin') {
      if (!store_id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Store ID é obrigatório para Store Admin'
        })
      }

      const store = data.stores.find(s => s.id === store_id)
      if (!store) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Loja não encontrada'
        })
      }

      // Verificar se já existe um store_admin para esta loja
      const existingStoreAdmin = data.users.find(u => 
        u.role === 'store_admin' && u.store_id === store_id
      )
      if (existingStoreAdmin) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Já existe um Store Admin para esta loja'
        })
      }
    }

    // Criar novo administrador
    const newAdmin = {
      id: getNextId('users', data),
      name,
      email,
      password, // Em produção, deve ser hasheada
      role,
      store_id: role === 'store_admin' ? store_id : undefined,
      created_at: new Date().toISOString()
    }

    // Adicionar aos dados
    data.users.push(newAdmin)
    saveData(data)

    // Retornar admin sem senha
    const { password: _, ...adminWithoutPassword } = newAdmin

    return {
      success: true,
      message: 'Administrador criado com sucesso',
      admin: adminWithoutPassword
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