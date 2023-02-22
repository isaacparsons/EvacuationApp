"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
function doesAlreadyExistError(error) {
    return error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
exports.default = doesAlreadyExistError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9lc0FscmVhZHlFeGlzdEVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvZG9lc0FscmVhZHlFeGlzdEVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQXdDO0FBRXhDLFNBQXdCLHFCQUFxQixDQUFDLEtBQVk7SUFDeEQsT0FBTyxLQUFLLFlBQVksZUFBTSxDQUFDLDZCQUE2QixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDO0FBQ3pGLENBQUM7QUFGRCx3Q0FFQyJ9