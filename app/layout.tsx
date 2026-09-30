import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "ERP Lite",
  description: "Projeto de estudo: Next.js + TypeScript + Prisma + PostgreSQL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col lg:flex-row">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
                {children}
              </main>
              <footer className="border-t border-border px-6 py-4 text-center text-xs text-faint">
                ERP Lite — Next.js + Prisma + PostgreSQL
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
