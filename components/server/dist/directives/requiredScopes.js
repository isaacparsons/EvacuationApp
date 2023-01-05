"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredScopesDirectiveTransformer = void 0;
const utils_1 = require("@graphql-tools/utils");
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const types_1 = require("../types");
const prisma = new client_1.PrismaClient();
// if org admin,
const getOrganizationFromGroupId = async (groupId) => {
    const group = await prisma.group.findUnique({
        where: {
            id: groupId
        },
        include: {
            organization: true
        }
    });
    return group === null || group === void 0 ? void 0 : group.organization;
};
function requiredScopesDirectiveTransformer(schema) {
    return (0, utils_1.mapSchema)(schema, {
        [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            var _a;
            const requiredScopesDirective = (_a = (0, utils_1.getDirective)(schema, fieldConfig, "requiredScopes")) === null || _a === void 0 ? void 0 : _a[0];
            if (requiredScopesDirective) {
                const { scopes } = requiredScopesDirective;
                const { resolve = graphql_1.defaultFieldResolver } = fieldConfig;
                fieldConfig.resolve = async function (source, args, context, info) {
                    if (scopes.includes(types_1.SCOPE_ORG_ADMIN)) {
                        if (args.organizationId) {
                            const orgMember = context.user.organizations.find((item) => item.organizationId === args.organizationId);
                            if (orgMember === null || orgMember === void 0 ? void 0 : orgMember.admin) {
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
                            const org = context.user.organizations.find((item) => item.organizationId === group.organizationId);
                            if (org === null || org === void 0 ? void 0 : org.admin) {
                                return resolve(source, args, context, info);
                            }
                            throw new Error("Must be an org admin");
                        }
                        throw new Error("Missing org id or group id");
                    }
                    if (scopes.includes(types_1.SCOPE_GROUP_ADMIN)) {
                        if (args.groupId) {
                            const groupMember = context.user.groups.find((item) => item.groupId === args.groupId);
                            if (groupMember === null || groupMember === void 0 ? void 0 : groupMember.admin) {
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
exports.requiredScopesDirectiveTransformer = requiredScopesDirectiveTransformer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZWRTY29wZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGlyZWN0aXZlcy9yZXF1aXJlZFNjb3Blcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnREFBMkU7QUFDM0UsMkNBQThDO0FBQzlDLHFDQUErQztBQUUvQyxvQ0FJa0I7QUFFbEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7QUFFbEMsZ0JBQWdCO0FBRWhCLE1BQU0sMEJBQTBCLEdBQUcsS0FBSyxFQUFFLE9BQWUsRUFBRSxFQUFFO0lBQzNELE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDMUMsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLE9BQU87U0FDWjtRQUNELE9BQU8sRUFBRTtZQUNQLFlBQVksRUFBRSxJQUFJO1NBQ25CO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsWUFBWSxDQUFDO0FBQzdCLENBQUMsQ0FBQztBQUVGLFNBQWdCLGtDQUFrQyxDQUFDLE1BQU07SUFDdkQsT0FBTyxJQUFBLGlCQUFTLEVBQUMsTUFBTSxFQUFFO1FBQ3ZCLENBQUMsa0JBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFOztZQUN6QyxNQUFNLHVCQUF1QixHQUFHLE1BQUEsSUFBQSxvQkFBWSxFQUMxQyxNQUFNLEVBQ04sV0FBVyxFQUNYLGdCQUFnQixDQUNqQiwwQ0FBRyxDQUFDLENBQUMsQ0FBQztZQUNQLElBQUksdUJBQXVCLEVBQUU7Z0JBQzNCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyx1QkFBdUIsQ0FBQztnQkFDM0MsTUFBTSxFQUFFLE9BQU8sR0FBRyw4QkFBb0IsRUFBRSxHQUFHLFdBQVcsQ0FBQztnQkFDdkQsV0FBVyxDQUFDLE9BQU8sR0FBRyxLQUFLLFdBQVcsTUFBTSxFQUFFLElB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