"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const schema_1 = require("@graphql-tools/schema");
const client_1 = require("@prisma/client");
const apollo_server_1 = require("apollo-server");
const fs_1 = require("fs");
const graphql_middleware_1 = require("graphql-middleware");
const logger_1 = __importDefault(require("./config/logger"));
const resolver_1 = require("./graphql/resolver");
const index_1 = require("./permissions/index");
const error_1 = require("./plugins/error");
const TokenService_1 = __importDefault(require("./services/TokenService"));
const tokenService = new TokenService_1.default();
const typeDefs = (0, fs_1.readFileSync)("src/graphql/schema.graphql", {
    encoding: "utf-8"
});
let schema = (0, schema_1.makeExecutableSchema)({
    typeDefs,
    resolvers: resolver_1.resolvers
});
schema = (0, graphql_middleware_1.applyMiddleware)(schema, index_1.permissions);
const auth = async ({ req }) => {
    const log = (0, logger_1.default)("Kiwitinohk Communications App");
    const prisma = new client_1.PrismaClient();
    const result = { db: prisma, log };
    if (req.headers.authorization) {
        const token = req.headers.authorization.replace("Bearer ", "");
        const { userId } = tokenService.verify(token);
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (user) {
            result.log = (0, logger_1.default)("Kiwitinohk Communications App", { userId: user.id });
            result.user = user;
        }
    }
    return result;
};
exports.server = new apollo_server_1.ApolloServer({
    schema,
    context: auth,
    plugins: [error_1.GraphQLErrorsHandler]
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBNkQ7QUFFN0QsMkNBQThDO0FBQzlDLGlEQUE2QztBQUM3QywyQkFBa0M7QUFDbEMsMkRBQXFEO0FBQ3JELDZEQUFxQztBQUNyQyxpREFBK0M7QUFDL0MsK0NBQWtEO0FBQ2xELDJDQUF1RDtBQUN2RCwyRUFBbUQ7QUFFbkQsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUFFeEMsTUFBTSxRQUFRLEdBQUcsSUFBQSxpQkFBWSxFQUFDLDRCQUE0QixFQUFFO0lBQzFELFFBQVEsRUFBRSxPQUFPO0NBQ2xCLENBQUMsQ0FBQztBQUVILElBQUksTUFBTSxHQUFHLElBQUEsNkJBQW9CLEVBQVU7SUFDekMsUUFBUTtJQUNSLFNBQVMsRUFBVCxvQkFBUztDQUNWLENBQUMsQ0FBQztBQUNILE1BQU0sR0FBRyxJQUFBLG9DQUFlLEVBQUMsTUFBTSxFQUFFLG1CQUFXLENBQUMsQ0FBQztBQVE5QyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQzdCLE1BQU0sR0FBRyxHQUFHLElBQUEsZ0JBQU0sRUFBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sTUFBTSxHQUFpQixJQUFJLHFCQUFZLEVBQUUsQ0FBQztJQUNoRCxNQUFNLE1BQU0sR0FBWSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDNUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtRQUM3QixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDeEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtTQUN0QixDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksRUFBRTtZQUNSLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBQSxnQkFBTSxFQUFDLCtCQUErQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO0tBQ0Y7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFVyxRQUFBLE1BQU0sR0FBRyxJQUFJLDRCQUFZLENBQUM7SUFDckMsTUFBTTtJQUNOLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLENBQUMsNEJBQW9CLENBQUM7Q0FDaEMsQ0FBQyxDQUFDIn0=