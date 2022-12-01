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
}
