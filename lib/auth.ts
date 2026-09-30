import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verificarToken } from "@/lib/session";

export { SESSION_COOKIE, verificarToken };

const EXPIRACAO = "7d";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET não definido no .env");
  return new TextEncoder().encode(secret);
}

// --- Senha (hash com bcrypt) ---
export async function hashSenha(senha: string) {
  return bcrypt.hash(senha, 10);
}

export async function verificarSenha(senha: string, senhaHash: string) {
  return bcrypt.compare(senha, senhaHash);
}

// --- Sessão (JWT em cookie httpOnly) ---
export async function criarSessao(usuario: { id: number; email: string }) {
  const token = await new SignJWT({ sub: String(usuario.id), email: usuario.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRACAO)
    .sign(getSecret());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function encerrarSessao() {
  cookies().delete(SESSION_COOKIE);
}

export async function getSessao() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verificarToken(token);
}
