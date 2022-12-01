import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash("1234", 10);
  const user1 = await prisma.user.upsert({
    where: { email: "isaac.2962@gmail.com" },
    update: {},
    create: {
      email: "isaac.2962@gmail.com",
      phoneNumber: "4039908793",
      firstName: "isaac",
      lastName: "parsons",
      passwordHash: hash,
      accountCreated: true
    }
  });
  const org1 = await prisma.organization.create({
    data: {
      name: "test org 1",
      groups: {
        create: {
          name: "test group 1",
          notificationSetting: {
            create: {
              emailEnabled: true,
              pushEnabled: true,
              smsEnabled: true
            }
          },
          members: {
            create: {
              user: {
                connect: { id: user1.id }
              },
              admin: false,
              status: "accepted"
            }
          }
        }
      },
      members: {
        create: {
          status: "accepted",
          admin: true,
          user: {
            connect: { id: user1.id }
          }
        }
      },
      announcements: {
        create: {
          title: "test announcement 1",
          description: "announcement description",
          date: new Date().toISOString(),
          createdBy: user1.id
        }
      }
    }
  });
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
