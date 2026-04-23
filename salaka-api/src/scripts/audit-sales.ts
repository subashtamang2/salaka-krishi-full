// Temporary script for auditing sales - currently disabled to prevent build errors
/*
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const bestSellers = await prisma.product.findMany({
    take: 5,
    orderBy: { sold: 'desc' },
    select: { name: true, sold: true, price: true }
  });

  console.log('Top 5 Best Sellers in DB:');
  console.table(bestSellers);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/
