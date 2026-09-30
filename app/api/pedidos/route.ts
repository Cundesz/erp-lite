import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/pedidos -> lista pedidos com cliente e itens (produtos)
export async function GET() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      cliente: true,
      itens: { include: { produto: true } },
    },
  });
  return NextResponse.json(pedidos);
}

// POST /api/pedidos -> cria um pedido com uma lista de itens
// body esperado: { clienteId: number, itens: [{ produtoId, quantidade }] }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clienteId, itens } = body;

  if (!clienteId || !Array.isArray(itens) || itens.length === 0) {
    return NextResponse.json(
      { error: "clienteId e ao menos um item são obrigatórios" },
      { status: 400 }
    );
  }

  // Busca o preço atual de cada produto, pra travar o valor no momento da venda
  const produtos = await prisma.produto.findMany({
    where: { id: { in: itens.map((i: { produtoId: number }) => i.produtoId) } },
  });

  const pedido = await prisma.pedido.create({
    data: {
      clienteId: Number(clienteId),
      itens: {
        create: itens.map((item: { produtoId: number; quantidade: number }) => {
          const produto = produtos.find((p) => p.id === item.produtoId);
          return {
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnit: produto?.preco ?? 0,
          };
        }),
      },
    },
    include: { cliente: true, itens: { include: { produto: true } } },
  });

  return NextResponse.json(pedido, { status: 201 });
}
