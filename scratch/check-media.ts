
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const media = await prisma.media.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(media, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
