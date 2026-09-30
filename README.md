# ERP Lite — Projeto de Estudo

Projeto simples de ERP (Clientes, Produtos e Pedidos) usando a mesma stack de
vagas de desenvolvedor full stack júnior: **Next.js + TypeScript + API Routes
(Node.js) + Prisma + PostgreSQL**.

## Pré-requisitos

- Node.js 18 ou superior instalado
- PostgreSQL instalado e rodando localmente (ou via Docker)

## 1. Criar o banco de dados

Abra o `psql` ou uma ferramenta como DBeaver/pgAdmin e crie um banco vazio:

```sql
CREATE DATABASE erp_lite;
```

Se preferir Docker, sem precisar instalar Postgres na máquina:

```bash
docker run --name erp-lite-db -e POSTGRES_PASSWORD=senha -e POSTGRES_DB=erp_lite -p 5432:5432 -d postgres:16
```

## 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com usuário, senha e nome do banco que você criou:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/erp_lite?schema=public"
```

## 3. Instalar dependências

```bash
npm install
```

## 4. Rodar as migrations (cria as tabelas no Postgres)

```bash
npx prisma migrate dev --name init
```

Isso lê o `prisma/schema.prisma`, cria as tabelas `Cliente`, `Produto`,
`Pedido` e `ItemPedido` no banco, e gera o Prisma Client.

## 5. (Opcional) Popular com dados de exemplo

```bash
npm run seed
```

## 6. Rodar o projeto

```bash
npm run dev
```

Acesse **http://localhost:3000**.

## Estrutura do projeto (e onde está cada conceito da vaga)

```
app/
  layout.tsx          -> layout raiz com o menu de navegação
  page.tsx            -> página inicial ("/")
  clientes/page.tsx    -> tela de CRUD de clientes (React + fetch)
  produtos/page.tsx    -> tela de CRUD de produtos
  pedidos/page.tsx     -> tela de criação de pedidos (junta cliente + produto)
  api/
    clientes/route.ts       -> GET (listar) e POST (criar) — API REST
    clientes/[id]/route.ts  -> GET, PUT, DELETE de um cliente específico
    produtos/...             -> mesma ideia pra produtos
    pedidos/...               -> mesma ideia pra pedidos (com itens relacionados)
lib/
  prisma.ts           -> instância única do Prisma Client (evita reconectar toda hora)
prisma/
  schema.prisma       -> modelo das tabelas do banco (Cliente, Produto, Pedido, ItemPedido)
  seed.js             -> script pra popular o banco com dados de teste
```

### Conceitos que esse projeto exercita

- **Next.js (App Router)**: rotas por pasta, tanto de páginas quanto de API
- **API Routes = seu "Node.js"**: cada `route.ts` dentro de `app/api/` é um
  endpoint REST rodando em Node, sem precisar de um servidor Express separado
- **TypeScript**: tipagem em todas as páginas e rotas
- **Prisma**: ORM que traduz `prisma.cliente.findMany()` em SQL de verdade,
  e cuida das migrations
- **PostgreSQL**: banco relacional de verdade, com relacionamento entre
  Cliente → Pedido → ItemPedido → Produto
- **API REST**: os verbos GET/POST/PUT/DELETE em cada rota

## Próximos passos sugeridos (pra você evoluir sozinho)

1. Adicionar autenticação simples (login) — dá pra usar NextAuth.js
2. Adicionar validação mais robusta (ex: biblioteca `zod`) nas rotas de API
3. Permitir vários itens no mesmo pedido de uma vez (o código já suporta
   isso na API, falta só o formulário permitir adicionar mais de uma linha)
4. Estilizar com Tailwind CSS (citado como diferencial na vaga)
5. Escrever um teste automatizado simples pra uma das rotas de API
