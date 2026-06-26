import { prisma } from "../app.js";
import bcrypt from "bcrypt";

const users = [
  {
    id: 1,
    email: "jean@snack-etoile.fr",
    password_clair: "password123"
  },
  {
    id: 2,
    email: "marie@snack-soleil.fr",
    password_clair: "password123"
  }
];

const products = [
  { name: "Portion de frites", quantity: 25, userId: 1 },
  { name: "Coca-Cola", quantity: 48, userId: 1 },
  { name: "Sprite", quantity: 30, userId: 1 },
  { name: "Chips", quantity: 50, userId: 2 },
  { name: "Glace vanille", quantity: 15, userId: 2 },
  { name: "Glace fraise", quantity: 20, userId: 2 }
];

async function main() {
  console.log("Start seeding ...");

  for (const user of users) {
    const hash = await bcrypt.hash(user.password_clair, 10);
    
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        password: hash
      },
      create: {
        id: user.id,
        email: user.email,
        password: hash
      }
    });
    console.log(`User created: ${user.email}`);
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { 
        name_userId: { name: product.name, userId: product.userId } 
      },
      update: {
        quantity: product.quantity
      },
      create: {
        name: product.name,
        quantity: product.quantity,
        userId: product.userId
      }
    });
    console.log(`Product created: ${product.name} for user ${product.userId}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });