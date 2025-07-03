const express = require('express');
module.exports = (db) => {
  const router = express.Router();

  // Listar todos os produtos
  router.get('/', (req, res) => {
    db.all('SELECT * FROM produtos', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // Endpoint de sincronização (exportar todos os produtos)
  router.get('/sincronizar', (req, res) => {
    db.all('SELECT * FROM produtos', [], (err, rows) => {
      if (err) return res.status(500).json({ sucesso: false, erro: err.message });
      res.json({ sucesso: true, produtos: rows });
    });
  });

  // Adicionar produto
  router.post('/', (req, res) => {
    const { nome, descricao, preco_media, preco_grande, imagem } = req.body;
    db.run(
      'INSERT INTO produtos (nome, descricao, preco_media, preco_grande, imagem) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, preco_media, preco_grande, imagem],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  });

  return router;
};