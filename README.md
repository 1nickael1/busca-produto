# Busca Produtos

Sistema de busca de produtos nas lojas da cidade desenvolvido com Nuxt 4, TypeScript, Tailwind CSS e SQLite3.

## Funcionalidades

### Para Usuários
- ✅ Busca de produtos por nome e cidade
- ✅ Listagem de lojas com filtros
- ✅ Visualização de detalhes das lojas
- ✅ Cadastro e login de usuários
- ✅ Alteração de senha e email
- ✅ Perfil do usuário

### Para Administradores
- ✅ Dashboard administrativo
- ✅ Gerenciamento completo de lojas (CRUD)
- ✅ Gerenciamento completo de produtos (CRUD)
- ✅ Criação de novos administradores
- ✅ Alteração de senha do admin

## Tecnologias Utilizadas

- **Frontend**: Nuxt 4 + TypeScript
- **Styling**: Tailwind CSS 4
- **Estado**: Pinia + pinia-plugin-persistedstate
- **Backend**: SQLite3 + Express (serverMiddleware)
- **Autenticação**: bcrypt para hash de senhas

## Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd busca-produto
```

2. Instale as dependências
```bash
npm install
```

3. Execute o projeto
```bash
npm run dev
```

4. Acesse http://localhost:3000

## Credenciais de Administrador

- **Email**: root
- **Senha**: 18181818

## Estrutura do Projeto

```
busca-produto/
├── api/                    # ServerMiddleware APIs
├── components/             # Componentes Vue
├── database/              # Arquivo SQLite3
├── middleware/            # Middlewares de autenticação
├── pages/                 # Páginas da aplicação
├── stores/                # Stores Pinia
└── assets/                # Assets CSS
```

## APIs Disponíveis

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/users/change-password` - Alterar senha
- `POST /api/users/change-email` - Alterar email

### Produtos e Lojas
- `GET /api/products` - Listar produtos
- `GET /api/stores` - Listar lojas
- `GET /api/search` - Busca integrada
- `GET /api/stores/:id/products` - Produtos da loja

### Admin APIs
- `GET/POST/PUT/DELETE /api/admin/stores` - CRUD lojas
- `GET/POST/PUT/DELETE /api/admin/products` - CRUD produtos
- `GET/POST /api/admin/admins` - Gerenciar admins
- `POST /api/admin/change-password` - Admin alterar senha

## Rotas do Sistema

### Públicas
- `/` - Página inicial com busca
- `/login` - Login de usuários
- `/register` - Cadastro de usuários
- `/products` - Listagem de produtos
- `/stores` - Listagem de lojas
- `/stores/:id` - Detalhes da loja

### Usuário (Protegidas)
- `/profile` - Perfil do usuário
- `/profile/change-password` - Alterar senha
- `/profile/change-email` - Alterar email

### Admin (Protegidas)
- `/admin/dashboard` - Dashboard administrativo
- `/admin/stores` - Gerenciar lojas
- `/admin/products` - Gerenciar produtos
- `/admin/admins` - Gerenciar administradores
- `/admin/profile` - Perfil do administrador

## Desenvolvimento

### Adicionar Dados de Teste

Para testar o sistema, você pode:

1. Fazer login como administrador (root/18181818)
2. Acessar o dashboard em `/admin/dashboard`
3. Criar algumas lojas e produtos
4. Testar a busca na página inicial

### Banco de Dados

O banco SQLite3 é criado automaticamente na primeira execução. O admin padrão é criado automaticamente.

## Deploy

Para fazer deploy:

1. Build do projeto
```bash
npm run build
```

2. Deploy na Vercel/Netlify ou similar

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

MIT
