import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    take: 5,
    select: { id: true, orderNumber: true }
  });
  console.log(JSON.stringify(orders, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
