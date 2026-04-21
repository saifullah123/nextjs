
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const media = await prisma.media.findMany({
    where: {
      name: {
        contains: 'Aarsh'
      }
    },
    take: 10
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
