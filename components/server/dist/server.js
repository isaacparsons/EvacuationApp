"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const schema_1 = require("@graphql-tools/schema");
const fs_1 = require("fs");
const apollo_server_1 = require("apollo-server");
const client_1 = require("@prisma/client");
const graphql_middleware_1 = require("graphql-middleware");
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
    const prisma = new client_1.PrismaClient();
    const result = { db: prisma };
    if (req.headers.authorization) {
        const token = req.headers.authorization.replace("Bearer ", "");
        const { userId } = tokenService.verify(token);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                groups: {
                    include: {
                        group: true
                    }
                },
                organizations: true
            }
        });
        if (user) {
            result.user = user;
        }
    }
    return result;
};
exports.server = new apollo_server_1.ApolloServer({
    schema,
    context: auth,
    // cors: {
    //   origin: [
    //     'http://localhost.com:3000',
    //     'http://ec2-3-19-24-165.us-east-2.compute.amazonaws.com',
    //     'https://studio.apollographql.com'
    //   ]
    // },
    plugins: [error_1.GraphQLErrorsHandler]
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBNkQ7QUFDN0QsMkJBQWtDO0FBRWxDLGlEQUE2QztBQUc3QywyQ0FBOEM7QUFDOUMsMkRBQXFEO0FBR3JELGlEQUErQztBQUMvQywrQ0FBa0Q7QUFDbEQsMkNBQXVEO0FBQ3ZELDJFQUFtRDtBQUVuRCxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUV4QyxNQUFNLFFBQVEsR0FBRyxJQUFBLGlCQUFZLEVBQUMsNEJBQTRCLEVBQUU7SUFDMUQsUUFBUSxFQUFFLE9BQU87Q0FDbEIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxNQUFNLEdBQUcsSUFBQSw2QkFBb0IsRUFBQztJQUNoQyxRQUFRO0lBQ1IsU0FBUyxFQUFULG9CQUFTO0NBQ1YsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxHQUFHLElBQUEsb0NBQWUsRUFBQyxNQUFNLEVBQUUsbUJBQVcsQ0FBQyxDQUFDO0FBUzlDLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7SUFDN0IsTUFBTSxNQUFNLEdBQWlCLElBQUkscUJBQVksRUFBRSxDQUFDO0lBQ2hELE1BQU0sTUFBTSxHQUFtQixFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUM5QyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFO1FBQzdCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0QsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN4QyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO1lBQ3JCLE9BQU8sRUFBRTtnQkFDUCxNQUFNLEVBQUU7b0JBQ04sT0FBTyxFQUFFO3dCQUNQLEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGO2dCQUNELGFBQWEsRUFBRSxJQUFJO2FBQ3BCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUNwQjtLQUNGO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRVcsUUFBQSxNQUFNLEdBQUcsSUFBSSw0QkFBWSxDQUFDO0lBQ3JDLE1BQU07SUFDTixPQUFPLEVBQUUsSUFBSTtJQUNiLFVBQVU7SUFDVixjQUFjO0lBQ2QsbUNBQW1DO0lBQ25DLGdFQUFnRTtJQUNoRSx5Q0FBeUM7SUFDekMsTUFBTTtJQUNOLEtBQUs7SUFDTCxPQUFPLEVBQUUsQ0FBQyw0QkFBb0IsQ0FBQztDQUNoQyxDQUFDLENBQUMifQ==