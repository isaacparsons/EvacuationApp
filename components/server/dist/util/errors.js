"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = exports.NotFoundError = void 0;
const graphql_1 = require("graphql");
const NotFoundError = (msg) => {
    return new graphql_1.GraphQLError(msg, {
        extensions: {
            code: "NotFound",
            http: {
                status: 404
            }
        }
    });
};
exports.NotFoundError = NotFoundError;
const AuthenticationError = (msg) => {
    new graphql_1.GraphQLError(msg, {
        extensions: {
            code: "UNAUTHENTICATED",
            http: {
                status: 400
            }
        }
    });
};
exports.AuthenticationError = AuthenticationError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUF1QztBQUVoQyxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO0lBQzNDLE9BQU8sSUFBSSxzQkFBWSxDQUFDLEdBQUcsRUFBRTtRQUMzQixVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsVUFBVTtZQUNoQixJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLEdBQUc7YUFDWjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBVFcsUUFBQSxhQUFhLGlCQVN4QjtBQUVLLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtJQUNqRCxJQUFJLHNCQUFZLENBQUMsR0FBRyxFQUFFO1FBQ3BCLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxpQkFBaUI7WUFDdkIsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRSxHQUFHO2FBQ1o7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQVRXLFFBQUEsbUJBQW1CLHVCQVM5QiJ9