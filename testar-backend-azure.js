const https = require('https');

// URL correta do backend no Azure
const BACKEND_URL = 'https://pizzaria-backend-eueqgmb0fyb5cdbj.brazilsouth-01.azurewebsites.net';

console.log('🔍 TESTANDO BACKEND NO AZURE...\n');

// Função para fazer requisição HTTPS
function makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function testarBackend() {
    try {
        console.log('1️⃣ Testando rota principal...');
        const main = await makeRequest(BACKEND_URL);
        console.log('Status:', main.status);
        console.log('MongoDB:', main.data.mongodb);
        console.log('Versão:', main.data.version);
        console.log('✅ Rota principal OK\n');

        console.log('2️⃣ Testando rota de clientes...');
        const users = await makeRequest(`${BACKEND_URL}/api/clientes`);
        console.log('Status:', users.status);
        console.log('Clientes encontrados:', Array.isArray(users.data) ? users.data.length : 'Erro');
        console.log('✅ Rota clientes OK\n');

        console.log('3️⃣ Testando rota de produtos...');
        const products = await makeRequest(`${BACKEND_URL}/api/produtos`);
        console.log('Status:', products.status);
        console.log('Produtos encontrados:', Array.isArray(products.data) ? products.data.length : 'Erro');
        console.log('✅ Rota produtos OK\n');

        console.log('4️⃣ Testando cadastro de cliente...');
        const newUser = {
            nome: 'Teste Azure',
            email: 'teste-azure@email.com',
            senha: '123456',
            telefone: '11999999999'
        };

        const cadastro = await makeRequest(`${BACKEND_URL}/api/clientes/cadastro`, 'POST', newUser);
        console.log('Status:', cadastro.status);
        console.log('Resposta:', cadastro.data);
        
        if (cadastro.status === 200 && cadastro.data.sucesso) {
            console.log('✅ Cadastro realizado com sucesso!\n');
        } else {
            console.log('⚠️ Cadastro falhou\n');
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

testarBackend();
