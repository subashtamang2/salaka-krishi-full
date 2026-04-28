import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMAGES: Record<string, string[]> = {
  'cauliflower-seed': ['cauliflower-dd0a4aa89110a99886bd583f7d4607842.png'],
  'lettuce-seasonal': ['lemon-9c3270a7a4a37f1afc736ce0391b3487.png'],
  'donec-seasonal': ['seasonal-vegetables-ac3fe5d65997c2e77347d9edaa4b8425.jpg'],
  'lemon-seasonal': ['lemon-9c3270a7a4a37f1afc736ce0391b3487.png'],
  'vermicompost-seed': ['vermicompost-54dd971ff5210c1bd8d35849bdd59b362.png'],
  'milk-seed': ['milk-2d53e4f74c752d986d110d63a7875101096.jpg'],
  'paneer-seed': ['paneer-de1169602ebc31c1045da2c38a3212595.jpg']
};

async function main() {
  console.log('Updating product images...');
  
  for (const [slug, images] of Object.entries(IMAGES)) {
    await prisma.product.update({
      where: { slug },
      data: { imageUrls: images }
    });
    console.log(`Updated images for ${slug}`);
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
