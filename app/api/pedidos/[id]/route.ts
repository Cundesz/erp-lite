import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(params.id) },
    include: { cliente: true, itens: { include: { produto: true } } },
  });
  if (!pedido) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }
  return NextResponse.json(pedido);
}

// PUT /api/pedidos/:id -> usado aqui pra atualizar o status (ex: "pago", "enviado")
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const pedido = await prisma.pedido.update({
    where: { id: Number(params.id) },
    data: { status: body.status },
  });
  return NextResponse.json(pedido);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.pedido.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
