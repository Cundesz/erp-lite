"use client";

import { useEffect, useState } from "react";

type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarClientes() {
    setCarregando(true);
    const res = await fetch("/api/clientes");
    const data = await res.json();
    setClientes(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function criarCliente(event: React.FormEvent) {
    event.preventDefault();
    setErro("");

    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone }),
    });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.error || "Erro ao criar cliente");
      return;
    }

    setNome("");
    setEmail("");
    setTelefone("");
    carregarClientes();
  }

  async function excluirCliente(id: number) {
    await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    carregarClientes();
  }

  return (
    <>
      <h1>Clientes</h1>
      <p className="subtitle">Cadastro simples de clientes do ERP.</p>

      <form onSubmit={criarCliente}>
        {erro && <div className="error">{erro}</div>}
        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="telefone">Telefone</label>
          <input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
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
              <th>Email</th>
              <th>Telefone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.email}</td>
                <td>{c.telefone || "-"}</td>
                <td>
                  <button className="danger" onClick={() => excluirCliente(c.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5}>Nenhum cliente cadastrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
