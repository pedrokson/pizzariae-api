// Tabela de preços dos sabores (exemplo, adapte para seu banco/dados)
const precosSabores = {
  bacon: { Média: 49.9, Grande: 59.9, default: 49.9 },
  portuguesa: { Média: 49.9, Grande: 59.9, default: 49.9 },
  '4queijos': { Média: 54.9, Grande: 64.9, default: 54.9 },
  // ...adicione todos os sabores
  // doces também!
};

const precosBorda = {
  'Catupiry': 7,
  'Cheddar': 7,
  'Chocolate': 8,
  'Cream Cheese': 8
};

// Função para calcular preço da pizza personalizada
function calcularPrecoPersonalizada(metade1, metade2, tamanho, borda) {
  const precoMetade1 = (precosSabores[metade1] && precosSabores[metade1][tamanho]) ? precosSabores[metade1][tamanho] : precosSabores[metade1]?.default || 49.9;
  const precoMetade2 = (precosSabores[metade2] && precosSabores[metade2][tamanho]) ? precosSabores[metade2][tamanho] : precosSabores[metade2]?.default || 49.9;
  const precoBorda = borda && borda !== '' && borda !== 'Sem borda' ? (precosBorda[borda] || 0) : 0;
  return (precoMetade1 / 2) + (precoMetade2 / 2) + precoBorda;
}

// Exemplo de uso no processamento do pedido
function processarItemPersonalizado(item) {
  const precoUnitario = calcularPrecoPersonalizada(item.metade1, item.metade2, item.tamanho, item.borda);
  return {
    tipo: 'personalizada',
    metade1: item.metade1,
    metade2: item.metade2,
    tamanho: item.tamanho,
    borda: item.borda,
    quantidade: item.quantidade,
    precoUnitario,
    preco: precoUnitario * item.quantidade
  };
}

// Função para gerar HTML (opcional)
function gerarHtmlPersonalizada(item, index) {
  return `<div style='margin-bottom:10px;border-bottom:1px solid #ccc;padding-bottom:5px;'>`
    + `<strong>${index + 1}. Pizza Personalizada</strong><br>`
    + `Metade 1: ${item.metade1}<br>`
    + `Metade 2: ${item.metade2}<br>`
    + (item.tamanho ? `Tamanho: ${item.tamanho}<br>` : '')
    + (item.borda && item.borda !== '' ? `Borda: ${item.borda}<br>` : 'Borda: Sem borda<br>')
    + `Qtd: ${item.quantidade}x &nbsp; Valor: R$ ${item.precoUnitario.toFixed(2)}<br>`
    + `Subtotal: R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}<br>`
    + `</div>`;
}

// Função para gerar texto (opcional)
function gerarTextoPersonalizada(item, index, linhaPequena) {
  let texto = `${index + 1}. PIZZA PERSONALIZADA\n`;
  texto += `   METADE 1: ${item.metade1}\n`;
  texto += `   METADE 2: ${item.metade2}\n`;
  if (item.tamanho) texto += `   TAMANHO: ${item.tamanho}\n`;
  if (item.borda && item.borda !== '') {
    texto += `   BORDA: ${item.borda}\n`;
  } else {
    texto += `   BORDA: Sem borda\n`;
  }
  texto += `   QTD: ${item.quantidade}x  VALOR: R$ ${item.precoUnitario.toFixed(2)}\n`;
  texto += `   SUBTOTAL: R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}\n`;
  texto += linhaPequena + "\n";
  return texto;
}

module.exports = {
  precosSabores,
  precosBorda,
  calcularPrecoPersonalizada,
  processarItemPersonalizado,
  gerarHtmlPersonalizada,
  gerarTextoPersonalizada
};