const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

console.log('🚀 Iniciando API da Pizzaria (Híbrido MongoDB + Memória)...');

// Variável para controlar se MongoDB está conectado
let mongoConnected = false;

// Banco de dados em memória como fallback
let usuariosMemoria = [];
let produtosMemoria = [
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

console.log('✅ Middlewares configurados');

// Conectar MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado!');
    mongoConnected = true;
  })
  .catch(err => {
    console.log('⚠️ MongoDB não conectado:', err.message);
    console.log('🔄 Usando banco de dados em memória como fallback');
    mongoConnected = false;
  });

// Rota principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API da Pizzaria Jerônimu\'s funcionando!',
    status: 'OK',
    version: '2.0.0',
    servidor: 'app.js principal (Híbrido)',
    timestamp: new Date().toISOString(),
    mongodb: mongoConnected ? 'Conectado' : 'Usando memória como fallback'
  });
});

console.log('✅ Rota principal criada');

// Carregar modelos MongoDB se conectado
let Usuario, Produto;

setTimeout(() => {
  if (mongoConnected) {
    try {
      console.log('📁 Carregando modelos MongoDB...');
      Usuario = require('./models/Usuario');
      Produto = require('./models/Produto');
      console.log('✅ Modelos MongoDB carregados');
    } catch (error) {
      console.log('⚠️ Erro ao carregar modelos:', error.message);
      mongoConnected = false;
    }
  }
}, 1000);

// POST /api/clientes/cadastro - Cadastro híbrido
app.post('/api/clientes/cadastro', async (req, res) => {
  try {
    console.log('Recebido cadastro:', req.body);
    
    const { nome, telefone, endereco, email, senha } = req.body;
    
    // Validações básicas
    if (!nome || !telefone || !email || !senha) {
      return res.json({ sucesso: false, erro: 'Todos os campos são obrigatórios' });
    }
    
    if (mongoConnected && Usuario) {
      // Usar MongoDB
      try {
        const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() });
        if (usuarioExistente) {
          console.log('E-mail já cadastrado no MongoDB!');
          return res.json({ sucesso: false, erro: 'E-mail já cadastrado!' });
        }
        
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
        
        const novoUsuario = new Usuario({
          nome,
          telefone,
          endereco: enderecoCompleto,
          email: email.toLowerCase(),
          senha,
          tipo: 'cliente'
        });
        
        await novoUsuario.save();
        console.log('Cliente cadastrado no MongoDB com sucesso');
        
        res.json({ sucesso: true, _id: novoUsuario._id, nome: novoUsuario.nome });
      } catch (error) {
        console.error('Erro MongoDB, usando memória:', error.message);
        // Fallback para memória
        cadastrarEmMemoria();
      }
    } else {
      // Usar memória
      cadastrarEmMemoria();
    }
    
    function cadastrarEmMemoria() {
      const usuarioExistente = usuariosMemoria.find(u => u.email === email.toLowerCase());
      if (usuarioExistente) {
        console.log('E-mail já cadastrado na memória!');
        return res.json({ sucesso: false, erro: 'E-mail já cadastrado!' });
      }
      
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
      
      const novoUsuario = {
        _id: (usuariosMemoria.length + 1).toString(),
        nome,
        telefone,
        endereco: enderecoCompleto,
        email: email.toLowerCase(),
        senha: bcrypt.hashSync(senha, 12),
        tipo: 'cliente',
        dataCadastro: new Date()
      };
      
      usuariosMemoria.push(novoUsuario);
      console.log('Cliente cadastrado na memória com sucesso');
      
      res.json({ sucesso: true, _id: novoUsuario._id, nome: novoUsuario.nome });
    }
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.json({ sucesso: false, erro: error.message });
  }
});

// GET /api/produtos - Produtos híbrido
app.get('/api/produtos', async (req, res) => {
  try {
    if (mongoConnected && Produto) {
      try {
        const produtos = await Produto.find({ disponivel: true });
        console.log('Produtos do MongoDB:', produtos.length);
        res.json(produtos);
      } catch (error) {
        console.error('Erro MongoDB produtos, usando memória:', error.message);
        res.json(produtosMemoria);
      }
    } else {
      console.log('Produtos da memória:', produtosMemoria.length);
      res.json(produtosMemoria);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

// GET /api/clientes - Lista de clientes
app.get('/api/clientes', async (req, res) => {
  try {
    if (mongoConnected && Usuario) {
      const clientes = await Usuario.find({ tipo: 'cliente' }).select('-senha');
      res.json(clientes);
    } else {
      const clientesSemSenha = usuariosMemoria.map(({ senha, ...usuario }) => usuario);
      res.json(clientesSemSenha);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

// GET /database - Página para visualizar banco
app.get('/database', async (req, res) => {
  try {
    let usuarios = [];
    let produtos = [];
    
    if (mongoConnected && Usuario && Produto) {
      usuarios = await Usuario.find({}).select('-senha');
      produtos = await Produto.find({});
    } else {
      usuarios = usuariosMemoria.map(({ senha, ...usuario }) => usuario);
      produtos = produtosMemoria;
    }
    
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
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
        .source { background: ${mongoConnected ? '#28a745' : '#ffc107'}; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍕 Banco de Dados da Pizzaria Jerônimu's</h1>
        <div style="text-align: center; margin: 10px 0;">
            <span class="source">Fonte: ${mongoConnected ? 'MongoDB Conectado' : 'Banco em Memória'}</span>
        </div>
        
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
                <h3>${mongoConnected ? 'MongoDB' : 'Memória'}</h3>
                <p>Tipo de Banco</p>
            </div>
        </div>

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
                </tr>
                ${usuarios.map(u => `
                <tr>
                    <td>${u._id}</td>
                    <td>${u.nome}</td>
                    <td>${u.email}</td>
                    <td>${u.telefone}</td>
                    <td>${u.endereco?.cidade || 'N/A'}</td>
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
    </div>
</body>
</html>`;
    res.send(html);
  } catch (error) {
    res.status(500).send('Erro: ' + error.message);
  }
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
  console.log(`🍕 Produtos: GET http://localhost:${PORT}/api/produtos`);
  console.log(`🗃️ Database: GET http://localhost:${PORT}/database`);
  console.log('');
  if (mongoConnected) {
    console.log('✅ MongoDB Conectado - Usando banco real');
  } else {
    console.log('💾 Usando banco de dados em memória como fallback');
  }
  console.log('🔄 Sistema híbrido ativo (MongoDB + Memória)');
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

console.log('✅ Servidor híbrido configurado (MongoDB + Memória)');
