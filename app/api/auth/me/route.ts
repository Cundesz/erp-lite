import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessao } from "@/lib/auth";

// GET /api/auth/me -> dados do usuário logado (ou 401)
export async function GET() {
  const sessao = await getSessao();
  if (!sessao) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(sessao.sub) },
    select: { id: true, nome: true, email: true },
  });
  if (!usuario) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  return NextResponse.json(usuario);
}
