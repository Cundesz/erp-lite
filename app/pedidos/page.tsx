"use client";

import { useEffect, useState } from "react";

type Cliente = { id: number; nome: string };
type Produto = { id: number; nome: string; preco: number };
type ItemPedido = {
  id: number;
  quantidade: number;
  precoUnit: number;
  produto: Produto;
};
type Pedido = {
  id: number;
  status: string;
  criadoEm: string;
  cliente: Cliente;
  itens: ItemPedido[];
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarTudo() {
    setCarregando(true);
    const [resPedidos, resClientes, resProdutos] = await Promise.all([
      fetch("/api/pedidos"),
      fetch("/api/clientes"),
      fetch("/api/produtos"),
    ]);
    setPedidos(await resPedidos.json());
    setClientes(await resClientes.json());
    setProdutos(await resProdutos.json());
    setCarregando(false);
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  async function criarPedido(event: React.FormEvent) {
    event.preventDefault();
    setErro("");

    if (!clienteId || !produtoId) {
      setErro("Selecione um cliente e um produto");
      return;
    }

    // Pedido simples: 1 pedido = 1 item (pra manter o exemplo direto).
    // Pra vários itens no mesmo pedido, é só mandar mais objetos no array "itens".
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId: Number(clienteId),
        itens: [{ produtoId: Number(produtoId), quantidade: Number(quantidade) }],
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.error || "Erro ao criar pedido");
      return;
    }

    setClienteId("");
    setProdutoId("");
    setQuantidade("1");
    carregarTudo();
  }

  async function avancarStatus(pedido: Pedido) {
    const proximos: Record<string, string> = {
      pendente: "pago",
      pago: "enviado",
      enviado: "entregue",
    };
    const novoStatus = proximos[pedido.status];
    if (!novoStatus) return;

    await fetch(`/api/pedidos/${pedido.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    carregarTudo();
  }

  function totalPedido(pedido: Pedido) {
    return pedido.itens.reduce((soma, item) => soma + item.quantidade * item.precoUnit, 0);
  }

  return (
    <>
      <h1>Pedidos</h1>
      <p className="subtitle">Criação de pedidos vinculando cliente e produto.</p>

      <form onSubmit={criarPedido}>
        {erro && <div className="error">{erro}</div>}
        <div className="field">
          <label htmlFor="cliente">Cliente</label>
          <select id="cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
            <option value="">Selecione</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="produto">Produto</label>
          <select id="produto" value={produtoId} onChange={(e) => setProdutoId(e.target.value)} required>
            <option value="">Selecione</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome} (R$ {p.preco.toFixed(2)})</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>
        <button type="submit">Criar pedido</button>
      </form>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.cliente.nome}</td>
                <td>
                  {p.itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(", ")}
                </td>
                <td>R$ {totalPedido(p).toFixed(2)}</td>
                <td><span className="status-badge">{p.status}</span></td>
                <td>
                  {p.status !== "entregue" && (
                    <button onClick={() => avancarStatus(p)}>Avançar status</button>
                  )}
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={6}>Nenhum pedido cadastrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
