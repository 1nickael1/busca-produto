import { findUserByEmail, loadData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // Validações básicas
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email e senha são obrigatórios'
      })
    }

    // Carregar dados dinâmicos
    const data = loadData()
    const user = findUserByEmail(email, data)

    if (!user || user.password !== password) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou senha incorretos'
      })
    }

    // Gerar token (em produção seria JWT)
    const token = `token_${user.id}_${Date.now()}`

    return {
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        store_id: user.store_id
      },
      token
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