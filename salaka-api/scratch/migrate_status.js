
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.order.updateMany({
            where: { orderStatus: 'WAITING_ESEWA' },
            data: { orderStatus: 'Pending' }
        });
        console.log(`Updated ${count.count} orders from WAITING_ESEWA to Pending`);
    } catch (error) {
        console.error('Error updating orders:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
