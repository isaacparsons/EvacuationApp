"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class UserRepository {
    constructor(db) {
        this.getUserByEmail = async (data) => {
            const { email } = data;
            const emailLowercase = email.toLowerCase();
            return await this.db.user.findUnique({
                where: { email: emailLowercase }
            });
        };
        this.getUserById = async (data) => {
            const { id } = data;
            return await this.db.user.findUnique({
                where: { id }
            });
        };
        this.createUser = async (data) => {
            const { email, phoneNumber, firstName, lastName, passwordHash } = data;
            const emailLowercase = email.toLowerCase();
            const firstNameLowerCase = firstName.toLowerCase();
            const lastNameLowerCase = lastName.toLowerCase();
            try {
                return await this.db.user.create({
                    data: {
                        email: emailLowercase,
                        phoneNumber,
                        passwordHash,
                        firstName: firstNameLowerCase,
                        lastName: lastNameLowerCase,
                        accountCreated: true
                    }
                });
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2002") {
                        throw new Error("An account with this email/phone number already exists");
                    }
                }
                throw error;
            }
        };
        this.updateUser = async (data) => {
            const { email, phoneNumber, firstName, lastName, passwordHash, accountCreated } = data;
            const emailLowercase = email.toLowerCase();
            const updateParams = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (phoneNumber && { phoneNumber })), (accountCreated && { accountCreated })), (firstName && { firstName: firstName.toLowerCase() })), (lastName && { lastName: lastName.toLowerCase() })), (passwordHash && { passwordHash }));
            return await this.db.user.update({
                where: { email: emailLowercase },
                data: updateParams
            });
        };
        this.deleteUser = async (data) => {
            const { email } = data;
            const user = await this.db.user.delete({
                where: { email: email.toLowerCase() }
            });
            return user;
        };
        this.getJoinedEntities = async (data) => {
            const { userId } = data;
            const user = await this.db.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    groups: {
                        include: {
                            group: true
                        }
                    },
                    organizations: {
                        include: {
                            organization: true
                        }
                    }
                }
            });
            return user;
        };
        this.db = db;
    }
}
exports.default = UserRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYi91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTREO0FBRTVELE1BQXFCLGNBQWM7SUFHakMsWUFBWSxFQUFnQjtRQUk1QixtQkFBYyxHQUFHLEtBQUssRUFBRSxJQUF1QixFQUFFLEVBQUU7WUFDakQsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztZQUN2QixNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDM0MsT0FBTyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDbkMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRTthQUNqQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFDRixnQkFBVyxHQUFHLEtBQUssRUFBRSxJQUFvQixFQUFFLEVBQUU7WUFDM0MsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQztZQUNwQixPQUFPLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUNuQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7YUFDZCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRixlQUFVLEdBQUcsS0FBSyxFQUFFLElBTW5CLEVBQUUsRUFBRTtZQUNILE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ3ZFLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMzQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuRCxNQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNqRCxJQUFJO2dCQUNGLE9BQU8sTUFB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