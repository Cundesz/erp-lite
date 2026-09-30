import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/produtos -> lista todos os produtos
export async function GET() {
  const produtos = await prisma.produto.findMany({
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(produtos);
}

// POST /api/produtos -> cria um novo produto
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, preco, estoque } = body;

  if (!nome || preco === undefined) {
    return NextResponse.json(
      { error: "Nome e preço são obrigatórios" },
      { status: 400 }
    );
  }

  const produto = await prisma.produto.create({
    data: { nome, preco: Number(preco), estoque: Number(estoque) || 0 },
  });
  return NextResponse.json(produto, { status: 201 });
}
