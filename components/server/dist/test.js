"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQThDO0FBRTlDLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBRWxDLEtBQUssVUFBVSxJQUFJO0lBQ2pCLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDOUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUN6QyxLQUFLLEVBQUU7WUFDTCxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUMzQjtRQUNELE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ0wsa0JBQWtCLEVBQUU7d0JBQ2xCLE1BQU0sRUFBRSxVQUFVO3FCQUNuQjtpQkFDRjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLElBQUk7aUJBQ1g7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1FBQ3ZCLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDL0IsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUVELElBQUksRUFBRTtLQUNILElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNmLE1BQU0sTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzdCLENBQUMsQ0FBQztLQUNELEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixNQUFNLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBRUwsOEJBQThCIn0=