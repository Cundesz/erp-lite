import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clientes -> lista todos os clientes
export async function GET() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(clientes);
}

// POST /api/clientes -> cria um novo cliente
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, email, telefone } = body;

  if (!nome || !email) {
    return NextResponse.json(
      { error: "Nome e email são obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const cliente = await prisma.cliente.create({
      data: { nome, email, telefone },
    });
    return NextResponse.json(cliente, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Não foi possível criar o cliente (email já existe?)" },
      { status: 400 }
    );
  }
}
