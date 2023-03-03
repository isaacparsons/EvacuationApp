"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const schema_1 = require("@graphql-tools/schema");
const apollo_server_1 = require("apollo-server");
const fs_1 = require("fs");
const graphql_middleware_1 = require("graphql-middleware");
const resolver_1 = require("./graphql/resolver");
const index_1 = require("./permissions/index");
const error_1 = require("./plugins/error");
const context_1 = require("./context");
const typeDefs = (0, fs_1.readFileSync)("src/graphql/schema.graphql", {
    encoding: "utf-8"
});
let schema = (0, schema_1.makeExecutableSchema)({
    typeDefs,
    resolvers: resolver_1.resolvers
});
schema = (0, graphql_middleware_1.applyMiddleware)(schema, index_1.permissions);
exports.server = new apollo_server_1.ApolloServer({
    schema,
    context: context_1.auth,
    plugins: [error_1.GraphQLErrorsHandler]
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFBNkQ7QUFDN0QsaURBQTZDO0FBQzdDLDJCQUFrQztBQUNsQywyREFBcUQ7QUFDckQsaURBQStDO0FBQy9DLCtDQUFrRDtBQUNsRCwyQ0FBdUQ7QUFDdkQsdUNBQTBDO0FBRTFDLE1BQU0sUUFBUSxHQUFHLElBQUEsaUJBQVksRUFBQyw0QkFBNEIsRUFBRTtJQUMxRCxRQUFRLEVBQUUsT0FBTztDQUNsQixDQUFDLENBQUM7QUFFSCxJQUFJLE1BQU0sR0FBRyxJQUFBLDZCQUFvQixFQUFVO0lBQ3pDLFFBQVE7SUFDUixTQUFTLEVBQVQsb0JBQVM7Q0FDVixDQUFDLENBQUM7QUFDSCxNQUFNLEdBQUcsSUFBQSxvQ0FBZSxFQUFDLE1BQU0sRUFBRSxtQkFBVyxDQUFDLENBQUM7QUFFakMsUUFBQSxNQUFNLEdBQUcsSUFBSSw0QkFBWSxDQUFDO0lBQ3JDLE1BQU07SUFDTixPQUFPLEVBQUUsY0FBSTtJQUNiLE9BQU8sRUFBRSxDQUFDLDRCQUFvQixDQUFDO0NBQ2hDLENBQUMsQ0FBQyJ9