import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testSlugs = [
  "ovelse-sentral-koordinering-opprettet",
  "test-testesen"
];

async function main() {
  const result = await prisma.article.deleteMany({
    where: {
      slug: {
        in: testSlugs
      }
    }
  });

  console.log(`Deleted ${result.count} test article(s).`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
