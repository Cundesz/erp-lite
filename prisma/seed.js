// Script de seed: popula o banco com alguns dados de exemplo.
// Rode com: npm run seed  (depois de já ter rodado prisma migrate)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const cliente1 = await prisma.cliente.upsert({
    where: { email: "maria@exemplo.com" },
    update: {},
    create: { nome: "Maria Souza", email: "maria@exemplo.com", telefone: "71999990000" },
  });

  const cliente2 = await prisma.cliente.upsert({
    where: { email: "carlos@exemplo.com" },
    update: {},
    create: { nome: "Carlos Lima", email: "carlos@exemplo.com" },
  });

  const produto1 = await prisma.produto.create({
    data: { nome: "Teclado Mecânico", preco: 250.0, estoque: 15 },
  });

  const produto2 = await prisma.produto.create({
    data: { nome: "Mouse sem fio", preco: 89.9, estoque: 30 },
  });

  await prisma.pedido.create({
    data: {
      clienteId: cliente1.id,
      itens: {
        create: [{ produtoId: produto1.id, quantidade: 1, precoUnit: produto1.preco }],
      },
    },
  });

  console.log("Seed concluído:", { cliente1, cliente2, produto1, produto2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
