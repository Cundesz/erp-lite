import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const produto = await prisma.produto.findUnique({
    where: { id: Number(params.id) },
  });
  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  return NextResponse.json(produto);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const produto = await prisma.produto.update({
    where: { id: Number(params.id) },
    data: {
      ...body,
      preco: body.preco !== undefined ? Number(body.preco) : undefined,
      estoque: body.estoque !== undefined ? Number(body.estoque) : undefined,
    },
  });
  return NextResponse.json(produto);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.produto.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
