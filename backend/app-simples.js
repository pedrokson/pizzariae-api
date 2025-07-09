const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

console.log('🚀 Iniciando API da Pizzaria (Modo Simples)...');

// CORS configurado para aceitar o frontend
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '..')));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Banco de dados em memória
let usuarios = [];
let produtos = [
  {
    _id: '1',
    nome: 'Pizza Margherita',
    descricao: 'Molho de tomate, mussarela, manjericão fresco',
    categoria: 'pizza',
    preco: 35.90,
    disponivel: true
  },
  {
    _id: '2', 
    nome: 'Pizza Pepperoni',
    descricao: 'Molho de tomate, mussarela, pepperoni',
    categoria: 'pizza',
    preco: 42.90,
    disponivel: true
  },
  {
    _id: '3',
    nome: 'Pizza Portuguesa',
    descricao: 'Molho de tomate, mussarela, presunto, ovos, cebola',
    categoria: 'pizza', 
    preco: 38.90,
    disponivel: true
  }
];

// Rota principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API da Pizzaria Jerônimu\'s funcionando!',
    status: 'OK',
    version: '2.0.0',
    servidor: 'app-simples.js',
    timestamp: new Date().toISOString(),
    modo: 'Desenvolvimento Simples (Sem MongoDB)'
  });
});

// POST /api/clientes/cadastro - Cadastro simplificado
app.post('/api/clientes/cadastro', async (req, res) => {
  try {
    console.log('Recebido cadastro:', req.body);
    
    const { nome, telefone, endereco, email, senha } = req.body;
    
    // Validações básicas
    if (!nome || !telefone || !email || !senha) {
      return res.json({ sucesso: false, erro: 'Todos os campos são obrigatórios' });
    }
    
    // Verificar se email já existe
    const usuarioExistente = usuarios.find(u => u.email === email.toLowerCase());
    if (usuarioExistente) {
      console.log('E-mail já cadastrado!');
      return res.json({ sucesso: false, erro: 'E-mail já cadastrado!' });
    }
    
    // Preparar estrutura de endereço
    let enderecoCompleto = endereco;
    if (typeof endereco === 'string') {
      enderecoCompleto = {
        rua: endereco,
        numero: 'S/N',
        bairro: 'Centro',
        cidade: 'São Paulo',
        cep: '00000-000',
        estado: 'SP'
      };
    } else if (endereco && !endereco.bairro) {
      enderecoCompleto = {
        rua: endereco.rua || 'Rua sem nome',
        numero: endereco.numero || 'S/N',
        complemento: endereco.complemento || '',
        bairro: 'Centro',
        cidade: 'São Paulo', 
        cep: '00000-000',
        estado: 'SP'
      };
    }
    
    // Criar novo usuário
    const novoUsuario = {
      _id: (usuarios.length + 1).toString(),
      nome,
      telefone,
      endereco: enderecoCompleto,
      email: email.toLowerCase(),
      senha: await bcrypt.hash(senha, 12),
      tipo: 'cliente',
      dataCadastro: new Date()
    };
    
    usuarios.push(novoUsuario);
    console.log('Cliente cadastrado com sucesso');
    
    res.json({ sucesso: true, _id: novoUsuario._id, nome: novoUsuario.nome });
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.json({ sucesso: false, erro: error.message });
  }
});

// POST /api/clientes/login - Login simplificado
app.post('/api/clientes/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.json({ sucesso: false, erro: 'Email e senha são obrigatórios' });
    }
    
    const usuario = usuarios.find(u => u.email === email.toLowerCase());
    if (!usuario) {
      return res.json({ sucesso: false, erro: 'Usuário não encontrado' });
    }
    
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.json({ sucesso: false, erro: 'Senha incorreta' });
    }
    
    const { senha: _, ...usuarioSemSenha } = usuario;
    res.json({ 
      sucesso: true, 
      usuario: usuarioSemSenha,
      token: 'token_fake_' + usuario._id
    });
  } catch (error) {
    res.json({ sucesso: false, erro: error.message });
  }
});

// GET /api/produtos - Lista de produtos
app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

// GET /api/clientes - Lista de clientes (para debug)
app.get('/api/clientes', (req, res) => {
  const clientesSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);
  res.json(clientesSemSenha);
});

// GET /api/database - Visualizar todo o banco de dados
app.get('/api/database', (req, res) => {
  const clientesSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);
  res.json({
    totalUsuarios: usuarios.length,
    totalProdutos: produtos.length,
    usuarios: clientesSemSenha,
    produtos: produtos,
    timestamp: new Date().toISOString()
  });
});

// GET /database - Página HTML para visualizar o banco
app.get('/database', (req, res) => {
  const clientesSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banco de Dados - Pizzaria</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #b22222; text-align: center; }
        h2 { color: #333; border-bottom: 2px solid #b22222; padding-bottom: 5px; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat { background: #b22222; color: white; padding: 15px; border-radius: 5px; flex: 1; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #b22222; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .json { background: #f8f8f8; padding: 10px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; max-height: 300px; overflow-y: auto; }
        .refresh { background: #b22222; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 0; }
        .refresh:hover { background: #8b1a1a; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍕 Banco de Dados da Pizzaria Jerônimu's</h1>
        
        <div class="stats">
            <div class="stat">
                <h3>${usuarios.length}</h3>
                <p>Usuários Cadastrados</p>
            </div>
            <div class="stat">
                <h3>${produtos.length}</h3>
                <p>Produtos Disponíveis</p>
            </div>
            <div class="stat">
                <h3>Em Memória</h3>
                <p>Tipo de Banco</p>
            </div>
        </div>

        <button class="refresh" onclick="location.reload()">🔄 Atualizar Dados</button>

        <div class="section">
            <h2>👥 Usuários Cadastrados</h2>
            ${usuarios.length > 0 ? `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Cidade</th>
                    <th>Data Cadastro</th>
                </tr>
                ${clientesSemSenha.map(u => `
                <tr>
                    <td>${u._id}</td>
                    <td>${u.nome}</td>
                    <td>${u.email}</td>
                    <td>${u.telefone}</td>
                    <td>${u.endereco?.cidade || 'N/A'}</td>
                    <td>${new Date(u.dataCadastro).toLocaleString('pt-BR')}</td>
                </tr>
                `).join('')}
            </table>
            ` : '<p>Nenhum usuário cadastrado ainda.</p>'}
        </div>

        <div class="section">
            <h2>🍕 Produtos Disponíveis</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Preço</th>
                    <th>Categoria</th>
                    <th>Disponível</th>
                </tr>
                ${produtos.map(p => `
                <tr>
                    <td>${p._id}</td>
                    <td>${p.nome}</td>
                    <td>${p.descricao}</td>
                    <td>R$ ${p.preco.toFixed(2)}</td>
                    <td>${p.categoria}</td>
                    <td>${p.disponivel ? '✅' : '❌'}</td>
                </tr>
                `).join('')}
            </table>
        </div>

        <div class="section">
            <h2>📊 Dados Completos (JSON)</h2>
            <div class="json">${JSON.stringify({
                totalUsuarios: usuarios.length,
                totalProdutos: produtos.length,
                usuarios: clientesSemSenha,
                produtos: produtos
            }, null, 2)}</div>
        </div>
    </div>
</body>
</html>`;
  res.send(html);
});

// DELETE /api/reset - Limpar dados para teste
app.delete('/api/reset', (req, res) => {
  usuarios = [];
  console.log('🗑️ Dados limpos - sistema resetado');
  res.json({ sucesso: true, message: 'Dados limpos com sucesso' });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('🚀 Backend iniciado!');
  console.log(`🌐 API rodando em: http://localhost:${PORT}`);
  console.log(`📋 Status: http://localhost:${PORT}`);
  console.log(`👥 Cadastro: POST http://localhost:${PORT}/api/clientes/cadastro`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/clientes/login`);
  console.log(`🍕 Produtos: GET http://localhost:${PORT}/api/produtos`);
  console.log('');
  console.log('💾 Usando banco de dados em memória');
  console.log('⚡ Modo desenvolvimento simples');
  console.log('');
  console.log('⏹️ Para parar: Ctrl+C');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso!`);
    console.log('💡 Execute: taskkill /f /im node.exe');
  } else {
    console.error('❌ Erro:', err.message);
  }
});

console.log('✅ Servidor configurado (modo simples)');
