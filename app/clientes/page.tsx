"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { initials } from "@/lib/utils";

type Cliente = { id: number; nome: string; email: string; telefone: string | null };

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    const res = await fetch("/api/clientes");
    setClientes(await res.json());
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.telefone ?? "").includes(q)
    );
  }, [clientes, busca]);

  async function criar(event: React.FormEvent) {
    event.preventDefault();
    setErro("");
    setSalvando(true);
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone }),
    });
    setSalvando(false);
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error || "Erro ao criar cliente");
      return;
    }
    setNome("");
    setEmail("");
    setTelefone("");
    carregar();
  }

  async function excluir(id: number) {
    if (!confirm("Excluir este cliente?")) return;
    await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    carregar();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <p className="mt-1 text-sm text-muted">
          {clientes.length} cliente(s) cadastrado(s).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo cliente</CardTitle>
          <CardDescription>Cadastro simples de clientes do ERP.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={criar} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {erro && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-400 sm:col-span-2 lg:col-span-4">
                {erro}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Maria Silva" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="maria@empresa.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={salvando} className="w-full">
                <Plus size={16} /> {salvando ? "Salvando…" : "Adicionar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Lista de clientes</CardTitle>
            <CardDescription>Busque por nome, email ou telefone.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar…" className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <p className="text-sm text-faint">Carregando…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {filtrados.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-600/30 bg-accent-500/10 text-[11px] font-bold text-accent-400">
                          {initials(c.nome)}
                        </span>
                        <span className="font-medium">{c.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted">{c.email}</TableCell>
                    <TableCell className="text-muted">{c.telefone || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => excluir(c.id)}>
                        <Trash2 size={14} /> Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-faint">
                      {busca ? "Nenhum resultado para a busca." : "Nenhum cliente cadastrado ainda."}
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
