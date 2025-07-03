const express = require('express');
module.exports = (db) => {
  const router = express.Router();

  // Listar todos os clientes
  router.get('/', (req, res) => {
    db.all('SELECT * FROM clientes', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // Cadastro de cliente (completo para formulário)
 router.post('/cadastro', (req, res) => {
  console.log('Recebido cadastro:', req.body);
  const { nome, telefone, endereco, email, senha } = req.body;
  db.get('SELECT * FROM clientes WHERE email = ?', [email], (err, row) => {
    if (row) {
      console.log('E-mail já cadastrado!');
      return res.json({ sucesso: false, erro: 'E-mail já cadastrado!' });
    }
    console.log('Tentando inserir no banco...');
    db.run(
      'INSERT INTO clientes (nome, telefone, endereco, email, senha) VALUES (?, ?, ?, ?, ?)',
      [nome, telefone, endereco, email, senha],
      function (err) {
        console.log('Callback do db.run chamado');
        if (err) {
          console.error('Erro SQLite:', err);
          return res.json({ sucesso: false, erro: 'Erro ao cadastrar!' });
        }
        res.json({ sucesso: true });
      }
    );
  });
});

  // Login de cliente
  router.post('/login', (req, res) => {
    const { email, senha } = req.body;
    db.get('SELECT * FROM clientes WHERE email = ? AND senha = ?', [email, senha], (err, row) => {
      if (row) {
        res.json({ sucesso: true });
      } else {
        res.json({ sucesso: false, erro: 'E-mail ou senha inválidos!' });
      }
    });
  });

  return router;
};