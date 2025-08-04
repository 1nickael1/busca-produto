const bodyParser = require('body-parser')
const app = require('express')()
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')

let db = new sqlite3.Database(__dirname + '/../database/db.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function(err) {
  if (err) {
    console.log('Erro ao conectar com banco:', err)
  } else {
    console.log('Conectado ao banco SQLite')
    initializeDatabase()
  }
})

// Inicializar banco de dados
function initializeDatabase() {
  db.serialize(() => {
    // Criar tabelas
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        category TEXT
      )
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1
      )
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS product_stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        store_id INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (store_id) REFERENCES stores(id)
      )
    `)

    // Criar admin padrão
    createAdminUser()
  })
}

// Criar usuário admin padrão
async function createAdminUser() {
  const hashedPassword = await bcrypt.hash('18181818', 10)
  db.run(`
    INSERT OR IGNORE INTO users (email, name, password_hash, role) 
    VALUES ('root', 'Administrador', ?, 'admin')
  `, [hashedPassword], function(err) {
    if (err) {
      console.log('Erro ao criar admin:', err)
    } else {
      console.log('Admin padrão criado: root / 18181818')
    }
  })
}

app.use(bodyParser.json())

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }
  
  // Verificar token (implementação simples)
  db.get('SELECT * FROM users WHERE id = ?', [token], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Token inválido' })
    }
    req.user = user
    next()
  })
}

// Middleware de admin
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' })
  }
  next()
}

// Rotas de autenticação
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token: user.id.toString()
    })
  })
})

app.post('/api/auth/register', async (req, res) => {
  const { email, name, password } = req.body
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  db.run(`
    INSERT INTO users (email, name, password_hash, role) 
    VALUES (?, ?, ?, 'user')
  `, [email, name, hashedPassword], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email já existe' })
      }
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    res.json({
      user: {
        id: this.lastID,
        email,
        name,
        role: 'user'
      },
      token: this.lastID.toString()
    })
  })
})

// Rotas de usuário
app.post('/api/users/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const userId = req.user.id
  
  db.get('SELECT password_hash FROM users WHERE id = ?', [userId], async (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    const isValid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValid) {
      return res.status(400).json({ error: 'Senha atual incorreta' })
    }
    
    const newHash = await bcrypt.hash(newPassword, 10)
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno' })
      }
      res.json({ success: true })
    })
  })
})

app.post('/api/users/change-email', authenticateToken, async (req, res) => {
  const { currentPassword, newEmail } = req.body
  const userId = req.user.id
  
  db.get('SELECT password_hash FROM users WHERE id = ?', [userId], async (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    const isValid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValid) {
      return res.status(400).json({ error: 'Senha incorreta' })
    }
    
    db.get('SELECT id FROM users WHERE email = ?', [newEmail], (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno' })
      }
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' })
      }
      
      db.run('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro interno' })
        }
        res.json({ success: true, newEmail })
      })
    })
  })
})

// Rotas de produtos
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    res.json({ products })
  })
})

app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, image_url, category } = req.body
  
  db.run(`
    INSERT INTO products (name, description, image_url, category) 
    VALUES (?, ?, ?, ?)
  `, [name, description, image_url, category], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    res.json({
      id: this.lastID,
      name,
      description,
      image_url,
      category
    })
  })
})

// Rotas de lojas
app.get('/api/stores', (req, res) => {
  db.all('SELECT * FROM stores WHERE is_active = 1', (err, stores) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    res.json({ stores })
  })
})

app.post('/api/stores', authenticateToken, requireAdmin, (req, res) => {
  const { name, address, phone, city, state } = req.body
  
  db.run(`
    INSERT INTO stores (name, address, phone, city, state) 
    VALUES (?, ?, ?, ?, ?)
  `, [name, address, phone, city, state], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    res.json({
      id: this.lastID,
      name,
      address,
      phone,
      city,
      state,
      is_active: 1
    })
  })
})

// Busca integrada
app.get('/api/search', (req, res) => {
  const { q, city } = req.query
  
  let query = `
    SELECT p.*, ps.price, ps.stock, s.name as store_name, s.city, s.state
    FROM products p
    JOIN product_stores ps ON p.id = ps.product_id
    JOIN stores s ON ps.store_id = s.id
    WHERE s.is_active = 1
  `
  
  const params = []
  
  if (q) {
    query += ' AND p.name LIKE ?'
    params.push(`%${q}%`)
  }
  
  if (city) {
    query += ' AND s.city LIKE ?'
    params.push(`%${city}%`)
  }
  
  db.all(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    res.json({ results })
  })
})

// Rotas administrativas
app.get('/api/admin/stores', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM stores', (err, stores) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    res.json({ stores })
  })
})

app.post('/api/admin/stores', authenticateToken, requireAdmin, (req, res) => {
  const { name, address, phone, city, state } = req.body
  
  db.run(`
    INSERT INTO stores (name, address, phone, city, state) 
    VALUES (?, ?, ?, ?, ?)
  `, [name, address, phone, city, state], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    res.json({
      id: this.lastID,
      name,
      address,
      phone,
      city,
      state,
      is_active: 1
    })
  })
})

app.put('/api/admin/stores/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params
  const { name, address, phone, city, state, is_active } = req.body
  
  db.run(`
    UPDATE stores SET name = ?, address = ?, phone = ?, city = ?, state = ?, is_active = ?
    WHERE id = ?
  `, [name, address, phone, city, state, is_active, id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }
    
    res.json({ success: true })
  })
})

app.delete('/api/admin/stores/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params
  
  db.run('DELETE FROM stores WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }
    
    res.json({ success: true })
  })
})

app.get('/api/admin/products', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    res.json({ products })
  })
})

app.post('/api/admin/products', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, image_url, category } = req.body
  
  db.run(`
    INSERT INTO products (name, description, image_url, category) 
    VALUES (?, ?, ?, ?)
  `, [name, description, image_url, category], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    res.json({
      id: this.lastID,
      name,
      description,
      image_url,
      category
    })
  })
})

app.get('/api/admin/admins', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT id, email, name, role, created_at FROM users WHERE role = "admin"', (err, admins) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    res.json({ admins })
  })
})

app.post('/api/admin/create-admin', authenticateToken, requireAdmin, async (req, res) => {
  const { email, name, password } = req.body
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  db.run(`
    INSERT INTO users (email, name, password_hash, role) 
    VALUES (?, ?, ?, 'admin')
  `, [email, name, hashedPassword], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email já existe' })
      }
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    res.json({
      id: this.lastID,
      email,
      name,
      role: 'admin'
    })
  })
})

app.post('/api/admin/change-password', authenticateToken, requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const adminId = req.user.id
  
  db.get('SELECT password_hash FROM users WHERE id = ?', [adminId], async (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'Erro interno' })
    }
    
    const isValid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValid) {
      return res.status(400).json({ error: 'Senha atual incorreta' })
    }
    
    const newHash = await bcrypt.hash(newPassword, 10)
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, adminId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno' })
      }
      res.json({ success: true })
    })
  })
})

module.exports = app 