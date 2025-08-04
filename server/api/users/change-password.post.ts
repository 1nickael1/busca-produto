import { findUserById, loadData, saveData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { currentPassword, newPassword } = body

    // Validações básicas
    if (!currentPassword || !newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Senha atual e nova senha são obrigatórias'
      })
    }

    if (newPassword.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'A nova senha deve ter pelo menos 6 caracteres'
      })
    }

    // Carregar dados dinâmicos
    const data = loadData()

    // Obter usuário do token (simulado)
    // Em produção, você extrairia o usuário do token JWT
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token de autenticação não fornecido'
      })
    }

    // Simular extração do ID do usuário do token
    // Em produção, você decodificaria o JWT
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

    // Atualizar senha
    const userIndex = data.users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      data.users[userIndex].password = newPassword
      saveData(data)
    }

    return {
      success: true,
      message: 'Senha alterada com sucesso'
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