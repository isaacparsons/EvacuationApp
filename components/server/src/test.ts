import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const uniqueUsers = new Map();
  const groups = await prisma.group.findMany({
    where: {
      OR: [{ id: 1 }, { id: 2 }]
    },
    include: {
      members: {
        where: {
          organizationMember: {
            status: "accepted"
          }
        },
        include: {
          user: true
        }
      }
    }
  });
  groups.forEach((group) => {
    group.members.forEach((member) => {
      uniqueUsers.set(member.userId, member.user);
    });
  });
  const uniqueUsersArr = Array.from(uniqueUsers).map((item) => item[1]);
  console.log(uniqueUsersArr);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// to run: npx ts-node test.ts
