// Teste simples do endpoint de cadastro
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testarCadastro() {
  const dadosTest = {
    nome: "João Test",
    telefone: "11999887766",
    endereco: {
      rua: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Centro",
      cidade: "São Paulo", 
      cep: "01234-567",
      estado: "SP"
    },
    email: "joao.test@email.com",
    senha: "123456"
  };

  try {
    const response = await fetch('http://localhost:3001/api/clientes/cadastro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosTest)
    });

    const result = await response.json();
    console.log('Resultado do teste:', result);
  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testarCadastro();
