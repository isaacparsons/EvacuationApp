import { Prisma } from "@prisma/client";

export default function doesAlreadyExistError(error: Error) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
