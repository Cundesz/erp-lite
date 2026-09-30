// Cria o usuário admin inicial com senha em hash (bcrypt).
// Rode com: npm run seed:admin
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@erp.com";
  const senha = "admin123";

  const senhaHash = await bcrypt.hash(senha, 10);

  const admin = await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: { nome: "Administrador", email, senhaHash },
  });

  console.log("Admin pronto:", { id: admin.id, email });
  console.log("Login:", email, "/ Senha:", senha);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
