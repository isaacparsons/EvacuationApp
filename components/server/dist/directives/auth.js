"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authDirectiveTransformer = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function authDirectiveTransformer(schema) {
    return (0, utils_1.mapSchema)(schema, {
        // Executes once for each object field in the schema
        [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            var _a;
            // Check whether this field has the specified directive
            const authDirective = (_a = (0, utils_1.getDirective)(schema, fieldConfig, "auth")) === null || _a === void 0 ? void 0 : _a[0];
            if (authDirective) {
                const { resolve = graphql_1.defaultFieldResolver } = fieldConfig;
                fieldConfig.resolve = async function (source, args, context, info) {
                    if (!context.user) {
                        throw new Error("Missing access token");
                    }
                    return await resolve(source, args, context, info);
                };
                return fieldConfig;
            }
        }
    });
}
exports.authDirectiveTransformer = authDirectiveTransformer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXJlY3RpdmVzL2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0RBQTJFO0FBQzNFLHFDQUErQztBQUMvQywyQ0FBMEU7QUFFMUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7QUFFbEMsU0FBZ0Isd0JBQXdCLENBQUMsTUFBTTtJQUM3QyxPQUFPLElBQUEsaUJBQVMsRUFBQyxNQUFNLEVBQUU7UUFDdkIsb0RBQW9EO1FBQ3BELENBQUMsa0JBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFOztZQUN6Qyx1REFBdUQ7WUFDdkQsTUFBTSxhQUFhLEdBQUcsTUFBQSxJQUFBLG9CQUFZLEVBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsMENBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckUsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE1BQU0sRUFBRSxPQUFPLEdBQUcsOEJBQW9CLEVBQUUsR0FBRyxXQUFXLENBQUM7Z0JBQ3ZELFdBQVcsQ0FBQyxPQUFPLEdBQUcsS0FBSyxXQUFXLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUk7b0JBQy9ELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO3dCQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7cUJBQ3pDO29CQUNELE9BQU8sTUFBTSxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3BELENBQUMsQ0FBQztnQkFDRixPQUFPLFdBQVcsQ0FBQzthQUNwQjtRQUNILENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBbEJELDREQWtCQyJ9