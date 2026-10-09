import { prisma } from "../lib/prisma";

const emails = [
  "user@gmail.com",
  "testeradmin@gmail.com",
  "superadmin@gmail.com",
  "testertechinian@gmail.com",
];

const users = await prisma.user.findMany({
  where: { email: { in: emails } },
  select: { email: true, role: true, emailVerified: true },
});

console.log(JSON.stringify(users, null, 2));
await prisma.$disconnect();
