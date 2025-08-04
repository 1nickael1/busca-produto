import { findUserByEmail, getNextId, loadData, saveData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, password, role = 'user' } = body

    // Validações básicas
    if (!name || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nome, email e senha são obrigatórios'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'A senha deve ter pelo menos 6 caracteres'
      })
    }

    // Carregar dados dinâmicos
    const data = loadData()

    // Verificar se email já existe
    const existingUser = findUserByEmail(email, data)

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email já cadastrado'
      })
    }

    // Criar novo usuário
    const newUser = {
      id: getNextId('users', data),
      name,
      email,
      password, // Em produção seria hash com bcrypt
      role,
      created_at: new Date().toISOString()
    }

    // Adicionar usuário aos dados
    data.users.push(newUser)
    saveData(data)

    // Gerar token (em produção seria JWT)
    const token = `token_${newUser.id}_${Date.now()}`

    return {
      success: true,
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
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