import { jwtVerify } from "jose";

export const SESSION_COOKIE = "erp_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET não definido no .env");
  return new TextEncoder().encode(secret);
}

// Edge-safe: só jose, sem bcrypt (usado pelo middleware)
export async function verificarToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { sub: string; email: string };
  } catch {
    return null;
  }
}
