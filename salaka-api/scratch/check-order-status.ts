import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { payment: true }
  });
  
  console.log('--- RECENT ORDERS ---');
  orders.forEach(o => {
    console.log(`ID: ${o.id} | Num: ${o.orderNumber} | OrderStatus: ${o.orderStatus} | PayStatus: ${o.payment?.status}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
