import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { Group, GroupMember, Prisma, PrismaClient } from "@prisma/client";
import { defaultFieldResolver } from "graphql";

const prisma = new PrismaClient();

export function authDirectiveTransformer(schema) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const authDirective = getDirective(schema, fieldConfig, "auth")?.[0];
      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source, args, context, info) {
          if (!context.user) {
            throw new Error("Missing access token");
          }
          return resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    }
  });
}
