"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatBRL } from "@/lib/utils";

type Cliente = { id: number; nome: string };
type Produto = { id: number; nome: string; preco: number };
type Pedido = {
  id: number;
  status: string;
  cliente: Cliente;
  itens: { quantidade: number; precoUnit: number; produto: Produto }[];
};

const statusVariant: Record<string, "default" | "info" | "warning" | "success" | "secondary"> = {
  pendente: "warning",
  pago: "info",
  enviado: "default",
  entregue: "success",
};

const proximoLabel: Record<string, string> = {
  pendente: "Marcar como pago",
  pago: "Marcar como enviado",
  enviado: "Marcar como entregue",
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
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    const [rP, rC, rPr] = await Promise.all([
      fetch("/api/pedidos"),
      fetch("/api/clientes"),
      fetch("/api/produtos"),
    ]);
    setPedidos(await rP.json());
    setClientes(await rC.json());
    setProdutos(await rPr.json());
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar(event: React.FormEvent) {
    event.preventDefault();
    setErro("");
    if (!clienteId || !produtoId) {
      setErro("Selecione um cliente e um produto");
      return;
    }
    setSalvando(true);
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId: Number(clienteId),
        itens: [{ produtoId: Number(produtoId), quantidade: Number(quantidade) }],
      }),
    });
    setSalvando(false);
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error || "Erro ao criar pedido");
      return;
    }
    setClienteId("");
    setProdutoId("");
    setQuantidade("1");
    carregar();
  }

  async function avancar(pedido: Pedido) {
    const proximos: Record<string, string> = { pendente: "pago", pago: "enviado", enviado: "entregue" };
    const novoStatus = proximos[pedido.status];
    if (!novoStatus) return;
    await fetch(`/api/pedidos/${pedido.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    carregar();
  }

  const total = (p: Pedido) => p.itens.reduce((s, i) => s + i.quantidade * i.precoUnit, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
        <p className="mt-1 text-sm text-muted">
          {pedidos.length} pedido(s) · vincule cliente e produto.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo pedido</CardTitle>
          <CardDescription>1 pedido = 1 item neste exemplo simples.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={criar} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {erro && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-400 sm:col-span-2 lg:col-span-4">
                {erro}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="cliente">Cliente</Label>
              <Select id="cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                <option value="">Selecione</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="produto">Produto</Label>
              <Select id="produto" value={produtoId} onChange={(e) => setProdutoId(e.target.value)} required>
                <option value="">Selecione</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome} ({formatBRL(p.preco)})</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input id="quantidade" type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={salvando} className="w-full">
                <Plus size={16} /> {salvando ? "Criando…" : "Criar pedido"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todos os pedidos</CardTitle>
          <CardDescription>Clique para avançar o status do pedido.</CardDescription>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <p className="text-sm text-faint">Carregando…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {pedidos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-muted">#{p.id}</TableCell>
                    <TableCell className="font-medium">{p.cliente.nome}</TableCell>
                    <TableCell className="text-muted">
                      {p.itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(", ")}
                    </TableCell>
                    <TableCell className="font-semibold">{formatBRL(total(p))}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[p.status] ?? "secondary"}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status !== "entregue" ? (
                        <Button variant="secondary" size="sm" onClick={() => avancar(p)} title={proximoLabel[p.status]}>
                          Avançar <ArrowRight size={14} />
                        </Button>
                      ) : (
                        <span className="text-xs text-faint">Concluído</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {pedidos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-faint">
                      Nenhum pedido cadastrado ainda.
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
