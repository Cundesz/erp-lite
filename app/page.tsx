"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Package, ShoppingCart, Wallet, ArrowRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";

type Cliente = { id: number; nome: string };
type Produto = { id: number; nome: string; preco: number; estoque: number };
type Pedido = {
  id: number;
  status: string;
  cliente: Cliente;
  itens: { quantidade: number; precoUnit: number; produto: Produto }[];
};

const statusVariant: Record<string, "default" | "info" | "warning" | "success"> = {
  pendente: "warning",
  pago: "info",
  enviado: "default",
  entregue: "success",
};

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/clientes").then((r) => r.json()),
      fetch("/api/produtos").then((r) => r.json()),
      fetch("/api/pedidos").then((r) => r.json()),
    ])
      .then(([c, p, o]) => {
        setClientes(c ?? []);
        setProdutos(p ?? []);
        setPedidos(o ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const receita = pedidos.reduce(
    (s, p) => s + p.itens.reduce((a, i) => a + i.quantidade * i.precoUnit, 0),
    0
  );
  const baixoEstoque = [...produtos].sort((a, b) => a.estoque - b.estoque).slice(0, 5);
  const recentes = [...pedidos].slice(-5).reverse();

  const kpis = [
    { label: "Clientes", value: String(clientes.length), icon: Users, hint: "cadastrados" },
    { label: "Produtos", value: String(produtos.length), icon: Package, hint: "no catálogo" },
    { label: "Pedidos", value: String(pedidos.length), icon: ShoppingCart, hint: "criados" },
    { label: "Receita", value: formatBRL(receita), icon: Wallet, hint: "soma dos pedidos" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gestão <span className="italic text-accent-400">simples</span>, dados{" "}
          <span className="italic text-accent-400">confiáveis</span>.
        </h1>
        <p className="mt-1 text-sm text-muted">
          Visão geral do seu ERP — Next.js + TypeScript + Prisma + PostgreSQL.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, hint }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-accent-600/30 bg-accent-500/10 text-accent-400">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-faint">{label}</p>
                <p className="truncate text-xl font-bold">
                  {loading ? "…" : value}
                </p>
                <p className="text-[11px] text-faint">{hint}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Pedidos recentes</CardTitle>
              <CardDescription>Últimas movimentações</CardDescription>
            </div>
            <Link href="/pedidos">
              <Button variant="secondary" size="sm">
                Ver todos <ArrowRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-faint">Carregando…</p>
            ) : recentes.length === 0 ? (
              <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-faint">
                Nenhum pedido ainda.{" "}
                <Link href="/pedidos" className="text-accent-400 hover:underline">
                  Criar o primeiro
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentes.map((p) => {
                  const total = p.itens.reduce((s, i) => s + i.quantidade * i.precoUnit, 0);
                  return (
                    <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          #{p.id} · {p.cliente.nome}
                        </p>
                        <p className="truncate text-xs text-faint">
                          {p.itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(", ")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm font-semibold">{formatBRL(total)}</span>
                        <Badge variant={statusVariant[p.status] ?? "secondary"}>{p.status}</Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Estoque baixo</CardTitle>
              <CardDescription>Precisam de reposição</CardDescription>
            </div>
            <Link href="/produtos">
              <Button variant="secondary" size="sm">
                Ver todos <ArrowRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-faint">Carregando…</p>
            ) : baixoEstoque.length === 0 ? (
              <p className="text-sm text-faint">Nenhum produto cadastrado.</p>
            ) : (
              <ul className="space-y-2">
                {baixoEstoque.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-card-2 px-3 py-2"
                  >
                    <span className="truncate text-sm">{p.nome}</span>
                    <Badge variant={p.estoque <= 5 ? "destructive" : "secondary"}>
                      {p.estoque <= 5 && <AlertTriangle size={12} className="mr-1" />}
                      {p.estoque} un
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
