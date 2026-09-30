import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clientes/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(params.id) },
    include: { pedidos: true },
  });
  if (!cliente) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  }
  return NextResponse.json(cliente);
}

// PUT /api/clientes/:id -> atualiza um cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const cliente = await prisma.cliente.update({
    where: { id: Number(params.id) },
    data: body,
  });
  return NextResponse.json(cliente);
}

// DELETE /api/clientes/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.cliente.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
