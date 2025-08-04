import { findUserByEmail, findUserById, loadData, saveData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { currentPassword, newEmail } = body

    // Validações básicas
    if (!currentPassword || !newEmail) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Senha atual e novo email são obrigatórios'
      })
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de email inválido'
      })
    }

    // Carregar dados dinâmicos
    const data = loadData()

    // Obter usuário do token (simulado)
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token de autenticação não fornecido'
      })
    }

    // Simular extração do ID do usuário do token
    const token = authHeader.replace('Bearer ', '')
    const userIdMatch = token.match(/token_(\d+)_/)
    
    if (!userIdMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token inválido'
      })
    }

    const userId = parseInt(userIdMatch[1])
    const user = findUserById(userId, data)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuário não encontrado'
      })
    }

    // Verificar senha atual
    if (user.password !== currentPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Senha atual incorreta'
      })
    }

    // Verificar se o novo email já existe
    const existingUser = findUserByEmail(newEmail, data)
    if (existingUser && existingUser.id !== userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Este email já está em uso'
      })
    }

    // Atualizar email
    const userIndex = data.users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      data.users[userIndex].email = newEmail
      saveData(data)
    }

    return {
      success: true,
      message: 'Email alterado com sucesso',
      newEmail: newEmail
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