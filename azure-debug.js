console.log('🔍 Azure Debug Script - Verificando configurações...');
console.log('📅 Data/Hora:', new Date().toISOString());
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🚪 PORT:', process.env.PORT);
console.log('🔗 MONGODB_URI:', process.env.MONGODB_URI ? 'Definido' : 'NÃO DEFINIDO');
console.log('🏠 __dirname:', __dirname);
console.log('📁 process.cwd():', process.cwd());
console.log('⚙️ Node.js version:', process.version);
console.log('💻 Platform:', process.platform);

// Testar se consegue iniciar servidor básico
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({
        message: 'Azure Debug funcionando!',
        timestamp: new Date().toISOString(),
        port: PORT,
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform
    });
});

app.listen(PORT, () => {
    console.log('✅ Debug server iniciado na porta:', PORT);
}).on('error', (err) => {
    console.error('❌ Erro ao iniciar debug server:', err);
});
