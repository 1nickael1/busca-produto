import { loadData } from '@/server/data'

export default defineEventHandler(async (event) => {
  try {
    // Carregar dados dinâmicos
    const data = loadData()
    
    // Filtrar apenas usuários admin e store_admin
    const admins = data.users.filter(user => 
      user.role === 'admin' || user.role === 'store_admin'
    ).map(admin => {
      // Remover senha dos dados retornados
      const { password, ...adminWithoutPassword } = admin
      return adminWithoutPassword
    })

    return {
      success: true,
      admins: admins
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
}) 