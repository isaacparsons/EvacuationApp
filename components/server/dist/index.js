"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const schema_1 = require("@graphql-tools/schema");
const apollo_server_1 = require("apollo-server");
const error_1 = require("./plugins/error");
const resolver_1 = require("./resolver");
const graphql_middleware_1 = require("graphql-middleware");
const TokenService_1 = __importDefault(require("./services/TokenService"));
const index_1 = require("./permissions/index");
const client_1 = require("@prisma/client");
const tokenService = new TokenService_1.default();
let schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: resolver_1.typeDefs,
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
exports.server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`); // tslint:disable-line no-console
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTZEO0FBRTdELGlEQUE2QztBQUc3QywyQ0FBdUQ7QUFDdkQseUNBQWlEO0FBQ2pELDJEQUFxRDtBQUNyRCwyRUFBbUQ7QUFHbkQsK0NBQWtEO0FBQ2xELDJDQUE4QztBQUU5QyxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUV4QyxJQUFJLE1BQU0sR0FBRyxJQUFBLDZCQUFvQixFQUFDO0lBQ2hDLFFBQVEsRUFBUixtQkFBUTtJQUNSLFNBQVMsRUFBVCxvQkFBUztDQUNWLENBQUMsQ0FBQztBQUNILE1BQU0sR0FBRyxJQUFBLG9DQUFlLEVBQUMsTUFBTSxFQUFFLG1CQUFXLENBQUMsQ0FBQztBQVM5QyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQzdCLE1BQU0sTUFBTSxHQUFpQixJQUFJLHFCQUFZLEVBQUUsQ0FBQztJQUNoRCxNQUFNLE1BQU0sR0FBbUIsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDOUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtRQUM3QixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDeEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtZQUNyQixPQUFPLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRTt3QkFDUCxLQUFLLEVBQUUsSUFBSTtxQkFDWjtpQkFDRjtnQkFDRCxhQUFhLEVBQUUsSUFBSTthQUNwQjtTQUNGLENBQUMsQ0FBQztRQUNILElBQUksSUFBSSxFQUFFO1lBQ1IsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDcEI7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVXLFFBQUEsTUFBTSxHQUFHLElBQUksNEJBQVksQ0FBQztJQUNyQyxNQUFNO0lBQ04sT0FBTyxFQUFFLElBQUk7SUFDYixVQUFVO0lBQ1YsY0FBYztJQUNkLG1DQUFtQztJQUNuQyxnRUFBZ0U7SUFDaEUseUNBQXlDO0lBQ3pDLE1BQU07SUFDTixLQUFLO0lBQ0wsT0FBTyxFQUFFLENBQUMsNEJBQW9CLENBQUM7Q0FDaEMsQ0FBQyxDQUFDO0FBRUgsY0FBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtJQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUNBQWlDO0FBQzlFLENBQUMsQ0FBQyxDQUFDIn0=