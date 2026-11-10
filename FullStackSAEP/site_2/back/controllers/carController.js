// -- "Olá, dev! Eu tenho uma pequena oficina e garagem de compra e venda de carros usados, a 
// -- 'Zé Veículos'. Hoje eu anoto todos os carros que entram para vender em um caderninho, 
// -- mas estou perdendo o controle. Preciso de um sistema bem simples onde eu consiga bater 
// -- o olho e ver todos os carros cadastrados no meu estoque.
// -- No sistema, preciso conseguir cadastrar um carro novo 
// -- (salvando o modelo/nome do carro, a marca, o ano e o preço dele). 
// -- Também preciso de um botão na tela para remover o carro do estoque quando eu 
// -- conseguir vender ele. Se você puder deixar os carros organizados na tela em 
// -- formato de cartões (cards), vai me ajudar muito!"
const pool = require('../database/database.js');

const verCarros = async (req, res) => {
    try {
        const query = `SELECT * FROM carro`;
        const resultado = await pool.query(query)
        // GET bem-sucedido retorna 200; rows contém os carros, inclusive uma lista vazia quando não há registros.
        return res.status(200).json({message: "GET feito com sucesso!", res: resultado.rows});
    } catch (err) {
        // Erros de banco são falhas do servidor, não um caso de recurso inexistente.
        console.error("Erro ao buscar carros:", err.message);
        return res.status(500).json({message: "Erro ao buscar carros."})
    }
}

const verClientes = async (req, res) => {
    try {
        const query = `
        SELECT * FROM users
        `;

        const resultado = await pool.query(query);
        return res.status(201).json({message: "GET dos clientes feito com sucesso!", res: resultado.rows})
    } catch (err) {
        console.error("Error ao fazer get...", err.message);
        return res.status(500).json({message: "Erro interno ao fazer get..."})
    }
}

const cadastrarCliente = async (req, res) => {
    try {
        const { nome, email } = req.body; // Tipo; EU QUERO ESSES DADOS

        const query = `
        INSERT INTO users (nome, email)
        VALUES ($1, $2)
        RETURNING *;
        `

        const values = [nome, email];
        const resultado = await pool.query(query, values);

        return res.status(201).json({message: "POST feito com sucesso!", res: resultado.rows})
    } catch (err) {
        console.error("Erro ao fazer cadastro", err.message);
        return res.status(500).json({message: "Errro ao fazer cadastro"});
    }
}

const cadastrarCarro = async (req, res) => {
    try {
        const {modelo, nome, marca, ano, preco, user_id} = req.body; 

        const query = `
        INSERT INTO carro (modelo, nome, marca, ano, preco, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `

        const values = [modelo, nome, marca, ano, preco, user_id];
        const resultado = await pool.query(query, values);
        return res.status(201).json({message: "Carro logado com sucesso!", res: resultado.rows});

    } catch (err) {
        console.error("Erro interno ao fazer cadastro do carro...", err.message);
        return res.status(500).json({message: "Erro ao fazer cadastro do carro..."});
    }
}

const deletarCarro = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query(
            'DELETE FROM carro WHERE id = $1 RETURNING id',
            [id]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({message: "Carro não encontrado."});
        }

        return res.status(200).json({message: "Carro removido com sucesso."});
    } catch (err) {
        console.error("Erro ao remover carro:", err.message);
        return res.status(500).json({message: "Erro ao remover carro."});
    }
}

const getID = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
        SELECT carro.modelo, carro.nome, carro.marca, carro.ano, carro.preco, carro.user_id, users.nome
        FROM carro
        INNER JOIN users ON carro.user_id = users.id
        WHERE users.id = $1
        `;

        const resultado = await pool.query(query, [id]);
        return res.status(201).json({message: "GET por id feito com sucesso!", res: resultado.rows});
    } catch (err) {
        console.error("Erro interno, o get não pode ser feito", err.message);
        return res.status(500).json({message: "Erro interno, o get não pode ser feito"});
    }
}

module.exports = {verCarros, cadastrarCliente, verClientes, cadastrarCarro, deletarCarro, getID}