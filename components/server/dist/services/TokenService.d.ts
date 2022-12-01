import { User } from "@prisma/client";
export default class TokenService {
    create: (user: User) => string;
    verify: (token: string) => {
        userId: number;
    };
}
