"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Package, ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, initials } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/pedidos", label: "Pedidos", icon: ShoppingCart },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setUsuario(data))
      .catch(() => {});
  }, []);

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Topbar mobile */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <span className="flex items-center gap-2 font-bold">
          <span className="text-accent-500">◆</span> ERP Lite
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md border border-border p-2 text-muted hover:text-stone-100"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <aside
        className={cn(
          "w-full shrink-0 border-b border-border bg-card lg:flex lg:min-h-screen lg:w-60 lg:flex-col lg:border-b-0 lg:border-r",
          open ? "flex flex-col" : "hidden lg:flex"
        )}
      >
        <div className="hidden items-center gap-2 border-b border-border px-5 py-5 lg:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-accent-400 to-accent-600 font-bold text-[#022c22]">
            ◆
          </span>
          <div>
            <p className="text-[15px] font-bold leading-none">ERP Lite</p>
            <p className="mt-1 text-[11px] text-faint">Gestão simples</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border border-accent-600/30 bg-accent-500/10 text-accent-400"
                    : "border border-transparent text-muted hover:bg-white/5 hover:text-stone-100"
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
          <button
            onClick={sair}
            className="flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-red-400 lg:hidden"
          >
            <LogOut size={17} />
            Sair{usuario ? ` (${usuario.nome})` : ""}
          </button>
        </nav>

        <div className="mt-auto hidden p-4 lg:block">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-faint">Tema</span>
            <ThemeToggle />
          </div>
          {usuario && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-card-2 p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-600/30 bg-accent-500/10 text-[11px] font-bold text-accent-400">
                {initials(usuario.nome)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{usuario.nome}</p>
                <p className="truncate text-[11px] text-faint">{usuario.email}</p>
              </div>
              <button
                onClick={sair}
                className="rounded-md p-1.5 text-faint hover:bg-white/5 hover:text-red-400"
                title="Sair"
                aria-label="Sair"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
          <div className="rounded-lg border border-border bg-card-2 p-3 text-xs text-muted">
            <p className="font-semibold text-accent-400">Stack de estudo</p>
            <p className="mt-1 leading-relaxed">Next.js + TypeScript + Prisma + PostgreSQL</p>
          </div>
        </div>
      </aside>
    </>
  );
}
