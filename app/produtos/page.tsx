"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatBRL } from "@/lib/utils";

type Produto = { id: number; nome: string; preco: number; estoque: number };

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    const res = await fetch("/api/produtos");
    setProdutos(await res.json());
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    if (!q) return produtos;
    return produtos.filter((p) => p.nome.toLowerCase().includes(q));
  }, [produtos, busca]);

  async function criar(event: React.FormEvent) {
    event.preventDefault();
    setErro("");
    setSalvando(true);
    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco, estoque }),
    });
    setSalvando(false);
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error || "Erro ao criar produto");
      return;
    }
    setNome("");
    setPreco("");
    setEstoque("");
    carregar();
  }

  async function excluir(id: number) {
    if (!confirm("Excluir este produto?")) return;
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    carregar();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
        <p className="mt-1 text-sm text-muted">
          {produtos.length} produto(s) no catálogo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo produto</CardTitle>
          <CardDescription>Adicione itens ao catálogo de venda.</CardDescription>
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
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Camiseta" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input id="preco" type="number" step="0.01" min="0" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="99.90" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="estoque">Estoque</Label>
              <Input id="estoque" type="number" min="0" value={estoque} onChange={(e) => setEstoque(e.target.value)} placeholder="10" />
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
            <CardTitle>Catálogo</CardTitle>
            <CardDescription>Busque por nome do produto.</CardDescription>
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
                  <TableHead>Produto</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {filtrados.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell>{formatBRL(p.preco)}</TableCell>
                    <TableCell>
                      <Badge variant={p.estoque <= 5 ? "destructive" : p.estoque <= 20 ? "warning" : "success"}>
                        {p.estoque} un
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => excluir(p.id)}>
                        <Trash2 size={14} /> Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-faint">
                      {busca ? "Nenhum resultado para a busca." : "Nenhum produto cadastrado ainda."}
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
