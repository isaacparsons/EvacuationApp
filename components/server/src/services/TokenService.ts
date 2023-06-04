import { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";

export default class TokenService {
  public create = (user: User) => {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
  };
  public verify = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
  };

  public createAccessToken = (userId: number) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "30m" });
    // return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "1m" });
  };
  public createRefreshToken = (userId: number) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH as string, { expiresIn: "14d" });
  };

  public verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
  };
  public verifyRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET_REFRESH as string) as {
      userId: number;
    };
  };
}
