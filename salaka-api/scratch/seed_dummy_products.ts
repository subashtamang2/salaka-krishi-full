import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ADMIN_ID = 'b9839c0f-876b-4d85-9d5b-b5cd2f58268f';

const CATEGORY_MAP: Record<string, string> = {
  'vegetables': 'fb7a3572-5b94-43c7-9ac4-dfa0fcf64c21',
  'seasonalVegetables': '4978f027-64e4-4bd4-bb5e-93df82ba41be',
  'milk': 'e798e6c4-632f-4a5b-b630-174c257867c8',
  'vermicompost': 'b5009294-9477-42a8-b9b5-a207a125eb47'
};

const productsData = [
    { name: "Cauliflower", price: 35, slug: "cauliflower-seed", category: "vegetables", isFeatured: true },
    { name: "Brinjal", price: 35, slug: "brinjal-seed", category: "vegetables", isFeatured: false },
    { name: "Lettuce", price: 35, slug: "lettuce-seasonal", category: "seasonalVegetables", isFeatured: true },
    { name: "Donec", price: 35, slug: "donec-seasonal", category: "seasonalVegetables", isFeatured: false },
    { name: "Lemon", price: 35, slug: "lemon-seasonal", category: "seasonalVegetables", isFeatured: true },
    { name: "Vermicompost", price: 35, slug: "vermicompost-seed", category: "vermicompost", isFeatured: true },
    { name: "Milk", price: 35, slug: "milk-seed", category: "milk", isFeatured: true },
    { name: "Paneer", price: 35, slug: "paneer-seed", category: "milk", isFeatured: true }
];

async function main() {
  console.log('Seeding dummy products...');
  
  for (const item of productsData) {
    const categoryId = CATEGORY_MAP[item.category];
    if (!categoryId) {
      console.log(`Skipping ${item.name} - unknown category ${item.category}`);
      continue;
    }

    try {
      await prisma.product.upsert({
        where: { slug: item.slug },
        update: {},
        create: {
          name: item.name,
          slug: item.slug,
          price: item.price,
          description: `This is a high-quality ${item.name} product from Salaka Krishi. Organic and fresh.`,
          categoryId: categoryId,
          addedBy: ADMIN_ID,
          status: 'Active',
          availability: 'InStock',
          stock: 100,
          isFeatured: item.isFeatured,
          imageUrls: [] 
        }
      });
      console.log(`Successfully seeded: ${item.name}`);
    } catch (error) {
      console.error(`Error seeding ${item.name}:`, error.message);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
