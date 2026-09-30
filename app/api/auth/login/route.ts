import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { criarSessao, verificarSenha } from "@/lib/auth";

// POST /api/auth/login -> { email, senha } => cria cookie de sessão
export async function POST(request: NextRequest) {
  const { email, senha } = await request.json();

  if (!email || !senha) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
  }

  const ok = await verificarSenha(senha, usuario.senhaHash);
  if (!ok) {
    return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
  }

  await criarSessao({ id: usuario.id, email: usuario.email });
  return NextResponse.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
}
