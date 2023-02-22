"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const Auth_1 = __importDefault(require("../resolvers/Auth"));
const EvacuationEvent_1 = __importDefault(require("../resolvers/EvacuationEvent"));
const Group_1 = __importDefault(require("../resolvers/Group"));
const merge_1 = require("@graphql-tools/merge");
const Organization_1 = __importDefault(require("../resolvers/Organization"));
exports.resolvers = (0, merge_1.mergeResolvers)([
    Auth_1.default,
    Group_1.default,
    EvacuationEvent_1.default,
    Organization_1.default
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ3JhcGhxbC9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw2REFBNkM7QUFDN0MsbUZBQW1FO0FBQ25FLCtEQUErQztBQUUvQyxnREFBc0Q7QUFDdEQsNkVBQTZEO0FBR2hELFFBQUEsU0FBUyxHQUFjLElBQUEsc0JBQWMsRUFBQztJQUNqRCxjQUFZO0lBQ1osZUFBYTtJQUNiLHlCQUF1QjtJQUN2QixzQkFBb0I7Q0FDckIsQ0FBQyxDQUFDIn0=