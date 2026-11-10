const { Pool } = require('pg');

const pool = new Pool ({
    user: 'postgres',
    database: 'garage',
    host: 'localhost',
    password: 'danillo',
    port: 5432
});

// Teste ultra simples de conexão
pool.connect().then(() => console.log('Banco Conectado!'));


module.exports = pool; // Com chaves, quando eu puxar, vem com chaves, sem importa sem