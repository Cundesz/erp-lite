import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "ERP Lite",
  description: "Projeto de estudo: Next.js + TypeScript + Prisma + PostgreSQL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <nav>
          <span className="brand">ERP Lite</span>
          <Link href="/">Início</Link>
          <Link href="/clientes">Clientes</Link>
          <Link href="/produtos">Produtos</Link>
          <Link href="/pedidos">Pedidos</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
