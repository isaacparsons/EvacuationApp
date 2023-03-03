"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() { }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQThDO0FBRTlDLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBRWxDLEtBQUssVUFBVSxJQUFJLEtBQUksQ0FBQztBQUV4QixJQUFJLEVBQUU7S0FDSCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDZixNQUFNLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUM7S0FDRCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakIsTUFBTSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQztBQUVMLDhCQUE4QiJ9