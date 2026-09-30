export default function Home() {
  return (
    <>
      <h1>
        Gest&atilde;o <em style={{ color: "var(--gold-400)", fontStyle: "italic" }}>simples</em>,
        {" "}dados <em style={{ color: "var(--gold-400)", fontStyle: "italic" }}>confi&aacute;veis</em>.
      </h1>
      <p className="subtitle">
        Projeto de estudo com Next.js (App Router), TypeScript, API Routes
        (Node.js), Prisma e PostgreSQL — a mesma stack usada em vagas de
        desenvolvedor full stack júnior.
      </p>
      <p>Use o menu acima para gerenciar Clientes, Produtos e Pedidos.</p>
    </>
  );
}
