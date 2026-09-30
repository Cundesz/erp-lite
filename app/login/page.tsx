"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(event: React.FormEvent) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    setCarregando(false);

    if (!res.ok) {
      const data = await res.json();
      setErro(data.error || "Não foi possível entrar");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-b from-accent-400 to-accent-600 text-lg font-bold text-[#022c22]">
            ◆
          </span>
          <CardTitle className="text-lg">ERP Lite</CardTitle>
          <CardDescription>Entre com seu email e senha.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={entrar} className="space-y-3">
            {erro && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-400">
                {erro}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ensira seu email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrar ? "text" : "password"}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrar(!mostrar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-stone-100"
                  aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrar ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={carregando} className="w-full">
              <LogIn size={16} /> {carregando ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
