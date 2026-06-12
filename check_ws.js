const prisma = require('./src/infrastructure/database/prismaClient');

async function check() {
  const ws = await prisma.workspace.findMany({
    include: { members: true },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  console.log(JSON.stringify(ws, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
