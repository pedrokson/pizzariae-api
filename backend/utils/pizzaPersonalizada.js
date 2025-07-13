// Funções utilitárias para pizza personalizada

const PRECO_FIXO_PERSONALIZADA = 49.90;

function processarItemPersonalizado(item) {
  return {
    tipo: 'personalizada',
    metade1: item.metade1,
    metade2: item.metade2,
    tamanho: item.tamanho,
    borda: item.borda,
    quantidade: item.quantidade,
    precoUnitario: PRECO_FIXO_PERSONALIZADA,
    preco: PRECO_FIXO_PERSONALIZADA * item.quantidade
  };
}

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
  PRECO_FIXO_PERSONALIZADA,
  processarItemPersonalizado,
  gerarHtmlPersonalizada,
  gerarTextoPersonalizada
};
