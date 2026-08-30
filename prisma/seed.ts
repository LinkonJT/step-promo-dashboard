import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const departments = [
  { name: "Tote-Bag Operations",   slug: "tote-bag-operations",   order: 1,  dashboardUrl: "/tote-bag" },
  { name: "Commercial",            slug: "commercial",            order: 2 },
  { name: "Freudenberg Project",   slug: "freudenberg-project",   order: 3 },
  { name: "Adhesive Project",      slug: "adhesive-project",      order: 4 },
  { name: "Micro-Pak",             slug: "micro-pak",             order: 5 },
  { name: "Shoe-Last",             slug: "shoe-last",             order: 6 },
  { name: "Accounts and Finance",  slug: "accounts-and-finance",  order: 7 },
  { name: "Marketing & Promotions", slug: "marketing-promotions", order: 8 },
  { name: "Footwear Retail Sales", slug: "footwear-retail-sales", order: 9,  dashboardUrl: "/retail" },
  { name: "Footwear Online Sales", slug: "footwear-online-sales", order: 10 },
  { name: "Other Projects",        slug: "other-projects",        order: 11 },
];

async function main() {
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: dept,
      create: dept,
    });
  }
  console.log(`Seeded ${departments.length} departments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());