import { User } from "@prisma/client";
export default class TokenService {
    create: (user: User) => string;
    verify: (token: string) => {
        userId: number;
    };
    createAccessToken: (userId: number) => string;
    createRefreshToken: (userId: number) => string;
    verifyAccessToken: (token: string) => {
        userId: number;
    };
    verifyRefreshToken: (token: string) => {
        userId: number;
    };
}
