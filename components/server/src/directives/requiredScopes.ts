import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { PrismaClient } from "@prisma/client";
import { defaultFieldResolver } from "graphql";
import { SCOPE_ORG_MEMBER } from "../types";
import {
  SCOPE_GROUP_ADMIN,
  SCOPE_GROUP_MEMBER,
  SCOPE_ORG_ADMIN
} from "../types";

const prisma = new PrismaClient();

// if org admin,

const getOrganizationFromGroupId = async (groupId: number) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId
    },
    include: {
      organization: true
    }
  });
  return group?.organization;
};

export function requiredScopesDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const requiredScopesDirective = getDirective(
        schema,
        fieldConfig,
        "requiredScopes"
      )?.[0];
      if (requiredScopesDirective) {
        const { scopes } = requiredScopesDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source, args, context, info) {
          if (scopes.includes(SCOPE_ORG_ADMIN)) {
            if (args.organizationId) {
              const orgMember = context.user.organizations.find(
                (item) => item.organizationId === args.organizationId
              );
              if (orgMember?.admin) {
                return resolve(source, args, context, info);
              }
              throw new Error("Must be an org admin");
            }
            if (args.groupId) {
              const group = await context.db.group.findUnique({
                where: {
                  id: args.groupId
                }
              });
              const org = context.user.organizations.find(
                (item) => item.organizationId === group.organizationId
              );
              if (org?.admin) {
                return resolve(source, args, context, info);
              }
              throw new Error("Must be an org admin");
            }
            throw new Error("Missing org id or group id");
          }
          if (scopes.includes(SCOPE_GROUP_ADMIN)) {
            if (args.groupId) {
              const groupMember = context.user.groups.find(
                (item) => item.groupId === args.groupId
              );
              if (groupMember?.admin) {
                return resolve(source, args, context, info);
              }
              throw new Error("Must be a group admin");
            }
            throw new Error("Missing group id");
          }
          throw new Error("Scope provided does not exist");
        };
        return fieldConfig;

        //     let orgId;
        //     if (args.organizationId) {
        //       orgId = args.organizationId;
        //     } else if (args.groupId) {
        //       const org = await getOrganizationFromGroupId(args.groupId);
        //       orgId = org?.id;
        //     } else {
        //       throw new Error("Missing organization or group id");
        //     }
        //     const member = await prisma.organizationMember.findUnique({
        //       where: {
        //         userId_organizationId: {
        //           userId: context.user.id,
        //           organizationId: orgId
        //         }
        //       }
        //     });
        //     if (!member || !member.admin) {
        //       throw new Error(
        //         "Organization member doesnt exist or is not an admin"
        //       );
        //     }
        //     return await resolve(source, args, context, info);
        //   }
        //   if (scopes.includes(SCOPE_GROUP_ADMIN)) {
        //     if (!args.groupId) {
        //       throw new Error("Missing group id");
        //     }
        //     const member = await prisma.groupMember.findUnique({
        //       where: {
        //         userId_groupId: {
        //           userId: context.user.id,
        //           groupId: args.groupId
        //         }
        //       }
        //     });
        //     if (!member || !member.admin) {
        //       throw new Error("Group member doesnt exist or is not an admin");
        //     }
        //     return await resolve(source, args, context, info);
        //   }
        //   throw new Error("Scope provided does not exist");
        // };
      }
    }
  });
}
