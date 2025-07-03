const express = require('express');
module.exports = (db) => {
  const router = express.Router();

  // Listar todos os pedidos
  router.get('/', (req, res) => {
    db.all('SELECT * FROM pedidos', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // Endpoint de sincronização (exportar todos os pedidos e itens)
  router.get('/sincronizar', (req, res) => {
    db.all('SELECT * FROM pedidos', [], (err, pedidos) => {
      if (err) return res.status(500).json({ sucesso: false, erro: err.message });
      db.all('SELECT * FROM itens_pedido', [], (err2, itens) => {
        if (err2) return res.status(500).json({ sucesso: false, erro: err2.message });
        res.json({ sucesso: true, pedidos, itens });
      });
    });
  });

  // Adicionar pedido (exemplo simples)
  router.post('/', (req, res) => {
    const { cliente_id, total, status } = req.body;
    db.run(
      'INSERT INTO pedidos (cliente_id, total, status) VALUES (?, ?, ?)',
      [cliente_id, total, status || 'Pendente'],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  });

  // Adicionar item ao pedido (com borda recheada)
  router.post('/itens', (req, res) => {
    const { pedido_id, produto_id, tamanho, quantidade, preco_unitario, borda_recheada } = req.body;
    db.run(
      'INSERT INTO itens_pedido (pedido_id, produto_id, tamanho, quantidade, preco_unitario, borda_recheada) VALUES (?, ?, ?, ?, ?, ?)',
      [pedido_id, produto_id, tamanho, quantidade, preco_unitario, borda_recheada],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  });

  return router;
};