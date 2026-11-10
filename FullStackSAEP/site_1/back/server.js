const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // 1. IMPORTANTE: Adicionado para o React conseguir acessar

const app = express();
app.use(express.json());
app.use(cors()); // 1. IMPORTANTE: Ativando o CORS

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'db_base',
    password: 'danillo',
    port: 5432
});

// GET: Listar todos os conteúdos
app.get('/contents', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contents ORDER BY title ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message: "Erro ao buscar conteúdos no server"});
    }
});

// POST: Cadastrar um novo conteúdo
app.post('/contents', async (req, res) => {
    try {
        const { category, description, title } = req.body;

        const cadastrar = `
        INSERT INTO contents (category, description, title)
        VALUES ($1, $2, $3)
        RETURNING *;
        `;

        const valores = [category, description, title];
        const resultado = await pool.query(cadastrar, valores);

        // Ajustado para retornar resultado.rows[0] (o objeto criado) em vez do log do banco inteiro
        return res.status(201).json({message: "Sucesso!", resultado: resultado.rows[0]});
    } catch (err) {
        console.error(err.message); // Corrigido de console.err para console.error
        return res.status(500).json({error: "Não foi possível fazer o cadastro do livro..."});
    }
});

// GET por ID: Busca os detalhes do conteúdo com a média de notas (A primeira duplicada foi removida)
app.get('/contents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        contents.*,
        ROUND(AVG(reviews.rating), 1) AS nota_media,
        COUNT(reviews.id) AS total_avaliacoes
      FROM contents
      LEFT JOIN reviews ON contents.id = reviews.content_id
      WHERE contents.id = $1
      GROUP BY contents.id;
    `;

    const resultado = await pool.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Conteúdo não encontrado" }); // Atualizado para 404 (Not Found)
    }

    return res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Erro interno no servidor ao buscar detalhes" });
  }
});

// POST: Cadastrar uma avaliação
app.post('/reviews', async (req, res) => {
    try {
        const { user_id, content_id, rating, comment, status } = req.body;

        const query = `
        INSERT INTO reviews (user_id, content_id, rating, comment, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *; 
        `;

        const valores = [user_id, content_id, rating, comment, status || 'Em andamento'];
        const resultado = await pool.query(query, valores);

        return res.status(201).json({message: "POST da review feita com sucesso!", resultado: resultado.rows[0]});
    } catch (err) {
        console.error(err.message);
        
        if (err.code === '23505') {
            return res.status(400).json({message: "Você já avaliou este conteúdo!"});
        };

        return res.status(500).json({message: "Erro ao salvar avaliação. Verifique se a nota é entre 1 e 5 e se o conteúdo existe."});
    }
});

// GET: Listar as avaliações de um conteúdo específico
app.get('/contents/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
        SELECT reviews.rating, reviews.comment, users.username
        FROM reviews
        INNER JOIN users ON reviews.user_id = users.id
        WHERE reviews.content_id = $1;
        `;
    
        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({message: "Não encontrado, sinto sorry ;)"});
        }

        return res.status(200).json(resultado.rows);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({message: "Perdão, não foi encontrado!"});
    }
});

// DELETE: Apagar uma avaliação
app.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM reviews WHERE id = $1 RETURNING *;`;
    const resultado = await pool.query(query, [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: "Essa avaliação não existe ou já foi deletada" });
    }

    return res.json({ message: "Avaliação deletada com sucesso!" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Erro ao tentar deletar a avaliação" });
  }
});

app.listen(3000, () => {
    console.log("Rodando...");
    console.log("http://localhost:3000/");
});
