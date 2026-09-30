# ERP Lite

Sistema de gestão comercial (clientes, produtos e pedidos) com dashboard, autenticação e temas claro/escuro. Deploy contínuo na Vercel com PostgreSQL na Neon.

**Demo:** https://erplite-rho.vercel.app · login `admin@erp.com` / `admin123`

## Funcionalidades

- **Dashboard** com KPIs (clientes, produtos, pedidos, receita), pedidos recentes e alerta de estoque baixo
- **Clientes** — cadastro, busca e exclusão
- **Produtos** — catálogo com preço, controle de estoque e badges por nível
- **Pedidos** — criação vinculada a cliente/produto, cálculo de total e fluxo de status (pendente → pago → enviado → entregue)
- **Autenticação** — login com senha em hash (bcrypt), sessão JWT em cookie httpOnly e rotas protegidas por middleware
- **Temas claro/escuro** com `next-themes`, layout responsivo com sidebar

## Stack

Next.js 14 (App Router) · TypeScript · API Routes · Prisma ORM · PostgreSQL · Tailwind CSS · shadcn/ui · next-themes · bcryptjs · jose

## Rodando localmente

Pré-requisitos: Node.js 18+ e PostgreSQL local (ou `docker run --name erp-lite-db -e POSTGRES_PASSWORD=senha -e POSTGRES_DB=erp_lite -p 5432:5432 -d postgres:16`).

```bash
cp .env.example .env   # preencha DATABASE_URL e AUTH_SECRET
npm install
npx prisma migrate dev # cria as tabelas e gera o Prisma Client
npm run seed:admin      # cria admin@erp.com / admin123
npm run seed            # dados de exemplo (opcional)
npm run dev            # http://localhost:3000
```

## Deploy

Push na `main` publica automaticamente na Vercel. O `npm run build` executa `prisma generate && prisma migrate deploy && next build`, então as migrations acompanham o deploy. Variáveis necessárias: `DATABASE_URL` (Neon, pooled) e `AUTH_SECRET`.

## Estrutura

```
app/
  page.tsx              -> dashboard com KPIs
  login/page.tsx        -> tela de login
  clientes|produtos|pedidos/page.tsx -> telas de gestão (client components + fetch)
  api/
    auth/login|logout|me -> autenticação e sessão
    clientes|[id] | produtos|[id] | pedidos|[id] -> REST (GET/POST/PUT/DELETE)
components/
  sidebar.tsx           -> navegação, usuário logado, logout, toggle de tema
  theme-provider.tsx / theme-toggle.tsx -> dark/light via next-themes
  ui/                   -> primitivos estilo shadcn (button, card, input, badge, table)
lib/
  prisma.ts             -> instância única do Prisma Client
  auth.ts               -> hash bcrypt + sessão JWT em cookie
  session.ts            -> verificação de token (edge-safe, usada no middleware)
middleware.ts           -> protege páginas e APIs, redireciona p/ /login
prisma/
  schema.prisma         -> Cliente, Produto, Pedido, ItemPedido, Usuario
  seed.js / seed-admin.js -> dados de exemplo e usuário admin
```
