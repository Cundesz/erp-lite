import { NextResponse } from "next/server";
import { encerrarSessao } from "@/lib/auth";

// POST /api/auth/logout -> apaga o cookie de sessão
export async function POST() {
  encerrarSessao();
  return NextResponse.json({ ok: true });
}
