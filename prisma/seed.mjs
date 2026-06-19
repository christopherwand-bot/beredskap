import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.article.upsert({
    where: {
      slug: "ovelse-sentral-koordinering-opprettet"
    },
    update: {},
    create: {
      title: "Øvelse: Sentral koordinering opprettet etter hendelse i sentrum",
      slug: "ovelse-sentral-koordinering-opprettet",
      kicker: "Øvelse",
      category: "Beredskap",
      excerpt:
        "Kommunen og nødetatene har etablert felles situasjonsforståelse og ber publikum følge oppdateringer fortløpende.",
      body: `## Situasjonen nå

Dette er en eksempelartikkel som gjør at avisen ser ferdig ut med en gang dere starter løsningen.

### Dette kan dere gjøre videre

- skrive om ingress og hovedtittel
- laste opp eget bilde i admin
- publisere flere støttesaker på forsiden

### Redaksjonell bruk i øvelse

Bruk artikkelen som mal for første melding, situasjonsoppdateringer og avklaringer til publikum.`,
      author: "Redaksjonen",
      featured: true,
      status: "PUBLISHED",
      publishedAt: new Date()
    }
  });
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
