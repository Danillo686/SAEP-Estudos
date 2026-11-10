import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [carros, setCarros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // 1. O Gatilho que busca os carros assim que a tela abre
  useEffect(() => {
    axios.get('http://localhost:3000/carros') // Se sua rota no router for /carros
      .then((resposta) => {
        // Seu backend envelopou os dados em "res", então pegamos resposta.data.res
        setCarros(resposta.data.res || []); 
      })
      .catch((err) => {
        setErro('Não foi possível carregar o estoque do Seu Zé.');
        console.error(err);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  // 2. A Função que deleta o carro (Disparada pelo botão)
  const lidarComVenda = (idDoCarro) => {
    // Avisa o motoboy (Axios) para ir na rota de DELETE do backend
    axios.delete(`http://localhost:3000/carros/${idDoCarro}`) // Ajuste a URL se sua rota no back for /carro/:id
      .then(() => {
        // Se o backend deletou com sucesso, limpamos a tela do React!
        // O .filter cria uma lista nova EXCLUINDO o carro que acabou de ser deletado
        const listaAtualizada = carros.filter(carro => carro.id !== idDoCarro);
        setCarros(listaAtualizada); // Atualiza o estado e a tela muda na hora!
        alert("Carro vendido com sucesso! 💰");
      })
      .catch((err) => {
        alert("Erro ao remover o carro do estoque.");
        console.error(err);
      });
  };

  // Renderização da Tela
  if (carregando) return <h2>Carregando o estoque do Seu Zé... 🚗</h2>;
  if (erro) return <h2 style={{ color: 'red' }}>{erro}</h2>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🚗 Garagem Zé Veículos</h1>
      <h3>Estoque Atual ({carros.length} veículos)</h3>

      {/* Container dos Cards */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        {carros.length === 0 ? (
          <p>O estoque está vazio! Seu Zé vendeu tudo! 🎉</p>
        ) : (
          carros.map((carro) => (
            <div 
              key={carro.id} 
              style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '220px', backgroundColor: '#f9f9f9' }}
            >
              <h4>{carro.marca} - {carro.modelo || carro.nome}</h4>
              <p><strong>Ano:</strong> {carro.ano}</p>
              <p style={{ color: 'green', fontWeight: 'bold' }}>R$ {carro.preco}</p>
              
              {/* O BOTÃO DE DELETAR */}
              <button 
                onClick={() => lidarComVenda(carro.id)}
                style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
              >
                🤝 Marcar como Vendido
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

import axios from 'axios';
import {useEffect, useState} from 'react';

const [carregando, setCarregando] = useState(true);
const [veiculos, setVeiculos] = useState([]);
const [error, setError] = useState("");

useEffect(() => { //Use Effect Apenas mostra na tela quando ela abrir de primeira, fazendo um gatilho ao abrir
  axios.get('http://localhost:3000/carros')
  .then((resposta) => { // resposta recebe os dados que são retornado do get
    setVeiculos(resposta.data.res || []);
  })
  .catch((err) => {
    setError("Não foi possível mostrar os carros!");
    console.error(err)
  })
  .finally(() => {
    setCarregando(false);
  })
}, []);


if (setCarregando) return <h2>Carregando estoque...</h2>
if (setError) return <h2>{error}</h2>

return (
  <div>
    <p>oi</p>
  </div>
)
