"use client";

import { useEffect, useState } from "react";

type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
};

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarProdutos() {
    setCarregando(true);
    const res = await fetch("/api/produtos");
    const data = await res.json();
    setProdutos(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function criarProduto(event: React.FormEvent) {
    event.preventDefault();
    setErro("");

    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco, estoque }),
    });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.error || "Erro ao criar produto");
      return;
    }

    setNome("");
    setPreco("");
    setEstoque("");
    carregarProdutos();
  }

  async function excluirProduto(id: number) {
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    carregarProdutos();
  }

  return (
    <>
      <h1>Produtos</h1>
      <p className="subtitle">Catálogo de produtos disponíveis pra venda.</p>

      <form onSubmit={criarProduto}>
        {erro && <div className="error">{erro}</div>}
        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="preco">Preço (R$)</label>
          <input
            id="preco"
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="estoque">Estoque</label>
          <input
            id="estoque"
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
          />
        </div>
        <button type="submit">Adicionar</button>
      </form>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>R$ {p.preco.toFixed(2)}</td>
                <td>{p.estoque}</td>
                <td>
                  <button className="danger" onClick={() => excluirProduto(p.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {produtos.length === 0 && (
              <tr>
                <td colSpan={5}>Nenhum produto cadastrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
