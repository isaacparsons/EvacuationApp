"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
const logger = (name) => bunyan_1.default.createLogger({
    name
    // streams: [
    //   {
    //     level: 'error',
    //     path: 'src/logs/tmp/myapp-error.log'
    //   }
    // ]
});
exports.default = logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUM5QixnQkFBTSxDQUFDLFlBQVksQ0FBQztJQUNsQixJQUFJO0lBQ0osYUFBYTtJQUNiLE1BQU07SUFDTixzQkFBc0I7SUFDdEIsMkNBQTJDO0lBQzNDLE1BQU07SUFDTixJQUFJO0NBQ0wsQ0FBQyxDQUFDO0FBRUwsa0JBQWUsTUFBTSxDQUFDIn0=