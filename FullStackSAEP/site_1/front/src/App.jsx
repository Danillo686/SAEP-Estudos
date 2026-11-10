import { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Importa o Axios

function App() {
  const [conteudos, setConteudos] = useState([]);

  useEffect(() => {
    // 2. Faz o GET. Repare que não precisa do segundo .then() e nem do .json()
    axios.get('http://localhost:3000/contents')
      .then((resposta) => {
        setConteudos(resposta.data); // O Axios joga o JSON direto dentro de .data
      })
      .catch((err) => {
        // Se o back-end der erro 400, 404, 500... cai direto aqui!
        console.error("Erro ao buscar dados com Axios:", err);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🚀 DevTracks</h1>
      <h2>Cursos e Livros Recomendados</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        {conteudos.length === 0 ? (
          <p>Nenhum conteúdo cadastrado ainda...</p>
        ) : (
          conteudos.map((item) => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3>{item.title}</h3>
              <p><strong>Categoria:</strong> {item.category}</p>
              <p>{item.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
